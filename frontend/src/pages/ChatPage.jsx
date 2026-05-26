import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { sendChatMessage } from "../utils/api";

const SUGGESTIONS = [
  "Which category has highest revenue?",
  "Predict next month revenue",
  "Which city performs best?",
  "Who are the top customers?",
  "What is the revenue trend?",
  "How many repeat customers do I have?",
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 fade-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: isUser ? "rgba(96,165,250,0.15)" : "var(--accent-muted)",
          border: `1px solid ${isUser ? "rgba(96,165,250,0.3)" : "rgba(74,222,128,0.3)"}`,
        }}
      >
        {isUser
          ? <User size={14} style={{ color: "#60a5fa" }} />
          : <Bot size={14} style={{ color: "var(--accent)" }} />
        }
      </div>
      <div
        className="max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={{
          background: isUser ? "rgba(96,165,250,0.1)" : "var(--bg-card)",
          border: `1px solid ${isUser ? "rgba(96,165,250,0.2)" : "var(--border)"}`,
          color: "var(--text-secondary)",
          borderTopRightRadius: isUser ? 4 : 16,
          borderTopLeftRadius: isUser ? 16 : 4,
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatPage({ uploadId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm SmartSales AI. Ask me anything about your sales data — trends, forecasts, top performers, or anything else.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (query) => {
    const q = query || input.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(uploadId, q);
      setMessages((m) => [...m, { role: "assistant", content: res.data.answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Make sure your data is loaded and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!uploadId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--text-muted)" }}>Upload data first to use AI Chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} style={{ color: "var(--accent)" }} />
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Syne" }}>
            AI Chat
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Ask natural language questions about your sales data
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-muted)", border: "1px solid rgba(74,222,128,0.3)" }}
            >
              <Bot size={14} style={{ color: "var(--accent)" }} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderTopLeftRadius: 4 }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full pulse-dot"
                    style={{ background: "var(--accent)", animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-2 rounded-xl transition-all"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex gap-3 p-2 rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-bright)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about your sales data..."
          className="flex-1 bg-transparent text-sm px-3 py-2 outline-none"
          style={{ color: "var(--text-primary)", fontFamily: "DM Sans" }}
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: input.trim() && !loading ? "var(--accent)" : "var(--bg-card-hover)",
            color: input.trim() && !loading ? "#0a0f0d" : "var(--text-muted)",
          }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
