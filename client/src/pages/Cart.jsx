import React, { useEffect, useState } from "react";
import axios from "../api/config";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadCart } from "../store/reducers/cartSlice";
import EmptyCart from "../components/EmptyCart";

const INR = "\u20B9";
const getRegisteredPhone = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const phoneCandidate =
      storedUser?.user?.phone ||
      storedUser?.phone ||
      storedUser?.user?.mobile ||
      storedUser?.mobile ||
      storedUser?.user?.contact ||
      storedUser?.contact ||
      "";
    return String(phoneCandidate).trim();
  } catch (e) {
    console.error("Failed to parse stored user", e);
    return "";
  }
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [updatingIds, setUpdatingIds] = useState({});
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  // persist delivery address (including phone) whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("deliveryAddress", JSON.stringify(address));
    } catch (e) {
      console.error("Failed to save delivery address", e);
    }
  }, [address]);

  // helper: format Date -> datetime-local value (YYYY-MM-DDTHH:MM)
  const formatDateTimeLocal = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [pickupInfo, setPickupInfo] = useState(() => ({ phone: "", pickTime: formatDateTimeLocal() }));

  // store pickup info for reuse
  useEffect(() => {
    try {
      localStorage.setItem("pickupInfo", JSON.stringify(pickupInfo));
    } catch (e) {
      console.error("Failed to save pickup info", e);
    }
  }, [pickupInfo]);
  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

  useEffect(() => {
    fetchCart();
    const registeredPhone = getRegisteredPhone();

    const savedPickup = localStorage.getItem("pickupInfo");
    if (savedPickup) {
      try {
        const parsed = JSON.parse(savedPickup);
        setPickupInfo((prev) => ({
          ...prev,
          ...parsed,
          phone: parsed.phone || registeredPhone || prev.phone,
        }));
      } catch (e) {
        console.error("Failed to parse saved pickup info", e);
      }
    } else {
      const savedPhone = localStorage.getItem("pickupPhone");
      if (savedPhone) {
        setPickupInfo((prev) => ({ ...prev, phone: savedPhone }));
      } else if (registeredPhone) {
        setPickupInfo((prev) => ({ ...prev, phone: registeredPhone }));
      }
    }

    const savedAddress = localStorage.getItem("deliveryAddress");
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress((prev) => ({
          ...prev,
          ...parsedAddress,
          phone: parsedAddress.phone || registeredPhone || prev.phone,
        }));
      } catch (e) {
        console.error(e);
      }
    } else if (registeredPhone) {
      setAddress((prev) => ({ ...prev, phone: registeredPhone }));
    }
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/cart");
      setCart(data);
      dispatch(loadCart(data));
    } catch (err) {
      console.log(err);
    }
  };

  const updateQty = async (id, type) => {
    try {
      setUpdatingIds((s) => ({ ...s, [id]: true }));
      const { data } = await axios.put(`/cart/item/${id}`, { type });
      setCart(data);
      dispatch(loadCart(data));
    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingIds((s) => ({ ...s, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`/cart/item/${id}`);
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const checkout = async (e) => {
    e.preventDefault();
    const selectedInfo = deliveryType === "home" ? address : pickupInfo;

    try {
      if (
        deliveryType === "home" &&
        (!selectedInfo.line1 || !selectedInfo.city || !selectedInfo.phone)
      ) {
        alert("Please provide a valid address and phone number.");
        return;
      }

      if (deliveryType === "pickup" && (!selectedInfo.phone || !selectedInfo.pickTime)) {
        alert("Please provide pickup details.");
        return;
      }

      const orderData = {
        products: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          portion: item.portion,
          price: item.price || item.product.price,
        })),
        total: cart.items.reduce(
          (sum, item) => sum + Math.round(item.price || item.product.price) * item.quantity,
          0,
        ),
        deliveryType,
        ...(deliveryType === "home" ? { address: selectedInfo } : { pickup: selectedInfo }),
      };

      if (paymentMethod === "offline") {
        await axios.post("/orders", orderData);
        alert("Order placed successfully!");
        setCart({ items: [] });
        dispatch(loadCart({ items: [] }));
        setShowCheckoutPopup(false);
        navigate("/myorders");
        return;
      }

      const {
        data: { razorpayOrder },
      } = await axios.post("/orders/razorpay", orderData);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Restaurant",
        order_id: razorpayOrder.id,
        handler: async (res) => {
          await axios.post("/orders/verify", res);
          setShowCheckoutPopup(false);
          navigate("/myorders");
        },
        theme: { color: "#4F46E5" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
    }
  };

  if (!cart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-600">Loading cart...</h2>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-gray-100 p-8 rounded-full mb-4 text-5xl">Cart</div>
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) return <EmptyCart />;

  const safeCart = cart?.items || [];
  const total = safeCart.reduce((sum, item) => {
    if (!item.product || !item.product.price) return sum;
    const itemPrice = Math.round(item.price || item.product.price);
    return sum + itemPrice * item.quantity;
  }, 0);
  const formattedTotal = Number(total).toFixed(0);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <h2 className="font-bold text-gray-700">Order Summary</h2>
              </div>
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <img src={item.product?.image} className="w-20 h-20 object-cover rounded-xl" alt="" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.product?.name}</h3>
                    <p className="text-indigo-600 font-medium flex items-center gap-2">
                      {INR}
                      {Number(item.price || item.product?.price || 0).toFixed(0)}
                      {item.portion && (
                        <span className="text-[9px] md:text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                          {item.portion === "half" ? "Half Plate" : "Full Plate"}
                        </span>
                      )}
                    </p>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-xs text-red-400 hover:text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item._id, "dec")}
                      disabled={updatingIds[item._id]}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, "inc")}
                      disabled={updatingIds[item._id]}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8">
              <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-2">Checkout</h2>
              <p>Total: {INR} {formattedTotal}</p>
              </div>
                
              <p className="text-sm text-gray-500 mb-6">
                Click below to enter delivery details and place your order.
              </p>
              <button
                type="button"
                onClick={() => setShowCheckoutPopup(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
              >
                Confirm & Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCheckoutPopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Delivery Details</h2>
              <button
                type="button"
                onClick={() => setShowCheckoutPopup(false)}
                className="text-gray-500 hover:text-gray-800 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setDeliveryType("pickup")}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  deliveryType === "pickup" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500"
                }`}
              >
                Pickup
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType("home")}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  deliveryType === "home" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500"
                }`}
              >
                Delivery
              </button>
            </div>

            <form onSubmit={checkout} className="space-y-4">
              {deliveryType === "home" ? (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <input
                    required
                    className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none border"
                    placeholder="Street Address"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      className="border-gray-200 rounded-xl p-3 border outline-none"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                    <input
                      required
                      className="border-gray-200 rounded-xl p-3 border outline-none"
                      placeholder="Zip"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                  </div>
                  {/* phone number for delivery; stored and re-used */}
                  <input
                    required
                    className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none border"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <input
                    required
                    className="w-full border-gray-200 rounded-xl p-3 border outline-none"
                    placeholder="Phone Number"
                    value={pickupInfo.phone}
                    onChange={(e) => setPickupInfo({ ...pickupInfo, phone: e.target.value })}
                  />
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Pickup Time</label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full border-gray-200 rounded-xl p-3 border outline-none"
                    value={pickupInfo.pickTime}
                    onChange={(e) =>
                      setPickupInfo({
                        ...pickupInfo,
                        pickTime: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <hr className="my-6 border-gray-50" />

              <h3 className="font-bold mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("offline")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "offline"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="text-sm font-bold">Cash</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "online"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="text-sm font-bold">UPI</div>
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-1 mb-6">
                {safeCart.map((item) => {
                  const itemName = item.product?.name || "Product";
                  const lineTotal = Math.round(item.price || item.product?.price || 0) * item.quantity;
                  return (
                    <div key={item._id} className="flex justify-between text-gray-600">
                      <span>{itemName}</span>
                      <span>
                        {INR}
                        {lineTotal}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {INR}
                    {formattedTotal}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
              >
                Confirm & Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
