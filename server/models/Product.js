import mongoose from "mongoose";

// In your Product model file (models/Product.js)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  foodType: {
    type: String,
    enum: ["veg", "nonveg"],
    default: "veg",
    required: true
  },
  image: { type: String, required: true },
  
  // ADD THESE TWO NEW FIELDS:
  hasPortionOptions: {
    type: Boolean,
    default: false
  },
  halfPlatePrice: {
    type: Number,
    required: function() {
      return this.hasPortionOptions;
    }
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
