import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
  price: Number,           // ✅ Store selected portion price
  portion: String          // ✅ Store "half" or "full"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
