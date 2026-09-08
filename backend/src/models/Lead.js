const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    note: {
      type: String
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "done"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;