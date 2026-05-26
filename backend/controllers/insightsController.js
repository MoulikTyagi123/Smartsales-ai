const Groq = require("groq-sdk");
const AnalyticsSummary = require("../models/AnalyticsSummary");

const getClient = () => {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not set");
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

function buildAnalyticsContext(summary) {
  return `
Sales Analytics Summary:
- Total Revenue: $${summary.totalRevenue?.toFixed(2)}
- Total Orders: ${summary.totalOrders}
- Average Order Value: $${summary.avgOrderValue?.toFixed(2)}
- Revenue Growth (MoM): ${summary.revenueGrowth?.toFixed(1)}%
- Unique Customers: ${summary.uniqueCustomers}
- Repeat Customers: ${summary.repeatCustomers}

Top Categories by Revenue:
${summary.topCategories
  ?.slice(0, 5)
  .map((c) => `  - ${c.name}: $${c.revenue?.toFixed(2)}`)
  .join("\n")}

Top Cities:
${summary.topCities
  ?.slice(0, 5)
  .map((c) => `  - ${c.name}: $${c.revenue?.toFixed(2)}`)
  .join("\n")}

Monthly Revenue Trend:
${summary.monthlyRevenue
  ?.slice(-6)
  .map((m) => `  - ${m.month}: $${m.revenue?.toFixed(2)}`)
  .join("\n")}

Customer Segments:
  - High Value: ${summary.customerSegments?.highValue} customers
  - Medium Value: ${summary.customerSegments?.mediumValue} customers
  - Low Value: ${summary.customerSegments?.lowValue} customers

6-Month Forecast:
${summary.forecastData?.map((f) => `  - ${f.month}: $${f.predicted?.toFixed(2)}`).join("\n")}
`.trim();
}

exports.generateInsights = async (req, res) => {
  const { uploadId } = req.params;
  try {
    const summary = await AnalyticsSummary.findOne({ uploadId });
    if (!summary) return res.status(404).json({ error: "Analytics not ready" });

    const client = getClient();
    const context = buildAnalyticsContext(summary);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a business intelligence analyst. Return ONLY a valid JSON array of 5 strings. No markdown, no explanation, no backticks. Just the raw JSON array.",
        },
        {
          role: "user",
          content: `Based on this sales data, generate exactly 5 specific, actionable business insights. Each insight must reference actual numbers from the data. Keep each under 2 sentences.\n\nData:\n${context}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0].message.content.trim();
    let insights;
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      insights = JSON.parse(cleaned);
    } catch {
      insights = text
        .split("\n")
        .filter((l) => l.trim().length > 10)
        .slice(0, 5);
    }

    await AnalyticsSummary.findOneAndUpdate(
      { uploadId },
      { aiInsights: insights },
    );
    res.json({ insights });
  } catch (err) {
    console.error("Insights error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to generate insights", details: err.message });
  }
};

exports.chatQuery = async (req, res) => {
  const { uploadId, query } = req.body;
  if (!uploadId || !query)
    return res.status(400).json({ error: "uploadId and query required" });

  try {
    const summary = await AnalyticsSummary.findOne({ uploadId });
    if (!summary) return res.status(404).json({ error: "Analytics not ready" });

    const client = getClient();
    const context = buildAnalyticsContext(summary);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are SmartSales AI, a helpful business analytics assistant. Answer questions using ONLY the provided sales data. Be concise and use actual numbers. If the question cannot be answered from the data, say so clearly.`,
        },
        {
          role: "user",
          content: `Sales Data:\n${context}\n\nQuestion: ${query}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 512,
    });

    const answer = completion.choices[0].message.content.trim();
    res.json({ answer, query });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Chat failed", details: err.message });
  }
};
