import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Razorpay from "razorpay";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { products, total, deliveryType, address, pickup, customerDetails } = req.body;

    // Validate products
    if (!products || !products.length) {
      return res.status(400).json({ message: "No products in order" });
    }

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
      products, // [{ product: productId, quantity }]
      total,
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

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { products, total, deliveryType, address, pickup, customerDetails } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 1. Create order in our database first
    const orderPayload = {
      products,
      total,
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
      amount: Math.round(total * 100), // amount in smallest currency unit (paise)
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

      return res.status(200).json({ message: "Payment verified successfully", order });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
