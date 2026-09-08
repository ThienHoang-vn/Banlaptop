const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0
    },
    thumbnail: {
      type: String
    },
    images: {
      type: [String]
    },
    specs: {
      cpu: {
        type: String
      },
      ram: {
        type: String
      },
      storage: {
        type: String
      },
      vga: {
        type: String
      },
      screen: {
        type: String
      }
    },
    description: {
      type: String
    },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock"],
      default: "in_stock"
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;