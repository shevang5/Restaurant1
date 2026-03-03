import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const emitOrderRefresh = (io, order) => {
  if (!io) return;
  try {
    io.emit("order:refresh", order);
  } catch (err) {
    console.error("Socket emit error:", err);
  }
};

const buildOrderProducts = async (user, incomingProducts = []) => {
  if (user?._id) {
    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
    if (cart?.items?.length) {
      const products = cart.items.map((item) => ({
        product: item.product?._id || item.product,
        quantity: item.quantity || 1,
        portion: item.portion === "half" ? "half" : "full",
        price: Number(item.price || item.product?.price || 0),
      }));

      const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { products, total };
    }
  }

  if (!incomingProducts?.length) {
    const err = new Error("No products in order");
    err.statusCode = 400;
    throw err;
  }

  const productIds = incomingProducts.map((p) => p.product);
  const productDocs = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(productDocs.map((p) => [String(p._id), p]));

  const products = incomingProducts.map((item) => {
    const doc = productMap.get(String(item.product));
    if (!doc) {
      const err = new Error("One or more products are invalid");
      err.statusCode = 400;
      throw err;
    }

    const portion = doc.hasPortionOptions && item.portion === "half" ? "half" : "full";
    const price =
      portion === "half" && doc.hasPortionOptions
        ? Number(doc.halfPlatePrice || doc.price)
        : Number(doc.price);

    return {
      product: item.product,
      quantity: Math.max(1, Number(item.quantity || 1)),
      portion,
      price,
    };
  });

  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { products, total };
};

export const createOrder = async (req, res) => {
  try {
    const { products, deliveryType, address, pickup, customerDetails } = req.body;

    const { products: normalizedProducts, total: computedTotal } = await buildOrderProducts(
      req.user,
      products
    );

    // If home delivery requested, ensure address is provided
    if (deliveryType === "home") {
      if (!address || !address.line1 || !address.city || !address.postalCode) {
        return res.status(400).json({ message: "Delivery address required for home delivery" });
      }
    }

    // If pickup requested, ensure pickup info is provided
    if (deliveryType === "pickup") {
      if (!pickup || !pickup.phone || !pickup.pickTime) {
        return res.status(400).json({ message: "Phone number and pick-up time are required for pickup orders" });
      }
    }

    // Create order (include delivery fields if provided)
    const orderPayload = {
      products: normalizedProducts,
      total: Number(computedTotal),
      deliveryType: deliveryType || "pickup",
    };

    // If user is authenticated, link the order to the user
    // If customerDetails is provided, it's a manual order (even if req.user exists, e.g. admin)
    if (customerDetails) {
      if (!customerDetails.name || !customerDetails.phone) {
        return res.status(400).json({ message: "Customer name and phone are required for manual orders" });
      }
      orderPayload.customerDetails = customerDetails;
      // Do NOT set orderPayload.user here, so it remains null/undefined
    } else if (req.user) {
      // Standard user order
      orderPayload.user = req.user._id;
    } else {
      return res.status(400).json({ message: "User or Customer Details required" });
    }

    if (deliveryType === "home") {
      orderPayload.address = address;
    } else if (deliveryType === "pickup") {
      orderPayload.pickup = {
        phone: pickup.phone,
        pickTime: new Date(pickup.pickTime)
      };
    }

    const order = await Order.create(orderPayload);

    // Populate product details
    await order.populate("products.product");

    // emit update to user room
    const io = req.app.get("io");
    if (io && order.user) {
      io.to(order.user.toString()).emit("order:update", order);
    }
    // broadcast a refresh for admin dashboards (including guest/manual orders)
    emitOrderRefresh(io, order);

    // Clear user's cart after successful order creation (only if user exists)
    if (req.user) {
      try {
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      } catch (err) {
        console.error("Failed to clear cart after order:", err);
        // Non-fatal: we still return the created order
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user").populate("products.product");
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  // emit to user room (maybe admin or other watches)
  const io = req.app.get("io");
  if (io && order && order.user) {
    io.to(order.user.toString()).emit("order:update", order);
  }
  emitOrderRefresh(io, order);
  res.json(order);
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Allow cancellation only when order hasn't progressed too far
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    order.status = "cancelled";
    await order.save();

    // emit update
    const io = req.app.get("io");
    if (io && order.user) {
      io.to(order.user.toString()).emit("order:update", order);
    }
    emitOrderRefresh(io, order);

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { products, deliveryType, address, pickup, customerDetails } = req.body;
    const { products: normalizedProducts, total: computedTotal } = await buildOrderProducts(
      req.user,
      products
    );

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 1. Create order in our database first
    const orderPayload = {
      products: normalizedProducts,
      total: Number(computedTotal),
      deliveryType: deliveryType || "pickup",
      status: "pending",
    };

    if (customerDetails) {
      orderPayload.customerDetails = customerDetails;
    } else if (req.user) {
      orderPayload.user = req.user._id;
    }

    if (deliveryType === "home") {
      orderPayload.address = address;
    } else if (deliveryType === "pickup") {
      orderPayload.pickup = {
        phone: pickup.phone,
        pickTime: new Date(pickup.pickTime)
      };
    }

    const order = await Order.create(orderPayload);

    // 2. Create Razorpay order
    const options = {
      amount: Math.round(computedTotal * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${order._id}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    // 3. Update our order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      order,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          isPaid: true,
          paidAt: Date.now(),
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "processing", // auto-move to processing if paid
        },
        { new: true }
      );

      // Clear cart
      if (order.user) {
        await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
      }

      const io = req.app.get("io");
      if (io && order?.user) {
        io.to(order.user.toString()).emit("order:update", order);
      }
      emitOrderRefresh(io, order);

      return res.status(200).json({ message: "Payment verified successfully", order });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
