const mongoose = require("mongoose");

const packSchema = new mongoose.Schema({
  poNumber: { type: String, required: true },
  buyerName: { type: String, required: true },
  otherRefNumber: { type: String },
  createdDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
  createdTime: {
    type: String,
    default: () => new Date().toTimeString().split(" ")[0],
  },
  updatedDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
  updatedTime: {
    type: String,
    default: () => new Date().toTimeString().split(" ")[0],
  },
  boxes: [
    {
      boxName: { type: String, required: true },
      status: { type: String, enum: ["open", "closed"], default: "open" },
      items: [
        {
          sku: { type: String, required: true },
          quantity: { type: Number, default: 1 },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Pack", packSchema);
