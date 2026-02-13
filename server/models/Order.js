import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Made optional for manual orders
  customerDetails: { // Added for manual orders
    name: String,
    phone: String
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      portion: { type: String, enum: ["half", "full"], default: "full" },
      price: Number
    }
  ],
  total: Number,
  deliveryType: {
    type: String,
    enum: ["pickup", "home"],
    default: "pickup",
  },
  address: {
    line1: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    phone: { type: String },
  },
  pickup: {
    phone: { type: String },
    pickTime: { type: Date }
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
