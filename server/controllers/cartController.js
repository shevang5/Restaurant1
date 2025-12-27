import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (i) => i.product.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  try {
    // productId comes from the URL param (DELETE /cart/:productId)
    const { productId } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate("items.product");

    res.json(cart);
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params; // cart item _id (subdocument id)
    const { type } = req.body; // 'inc' or 'dec'

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (type === "inc") item.quantity += 1;
    else if (type === "dec") item.quantity = Math.max(1, item.quantity - 1);

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error("Update item quantity error:", err);
    res.status(500).json({ message: err.message });
  }
};
