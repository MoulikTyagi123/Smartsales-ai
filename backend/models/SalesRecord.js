const mongoose = require("mongoose");

const SalesRecordSchema = new mongoose.Schema(
  {
    uploadId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    customer: { type: String, required: true },
    category: { type: String, required: true },
    revenue: { type: Number, required: true },
    city: { type: String, default: "Unknown" },
    quantity: { type: Number, default: 1 },
    orderId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalesRecord", SalesRecordSchema);
