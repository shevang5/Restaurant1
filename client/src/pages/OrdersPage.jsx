import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetUserOrders, asyncCancelOrder } from "../store/action/orderActions";

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(asyncGetUserOrders());

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      dispatch(asyncGetUserOrders());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading orders...</p>;

  if (!orders || orders.length === 0)
    return (
      <p className="text-center py-16 text-gray-500">
        🛒 You have no orders yet.
      </p>
    );

  const statusOrder = ["pending", "processing", "shipped", "delivered"];

  // Badge styles for each status
  const statusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Sort orders so that newest ones appear first
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {sortedOrders.map((order) => {
        const statusIndex = statusOrder.indexOf(order.status);
        console.log(order);


        return (
          <div key={order._id} className="relative bg-white p-4 mb-6 rounded shadow-md">
            {/* created time (small, light text in corner) */}
            {order.createdAt && (
              <p className="absolute top-1 right-3 text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
            )}

            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <span className={`px-3 py-1 rounded-full font-semibold ${statusBadge(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
              <p>
                <span className="font-semibold">Total:</span> ${order.total?.toFixed(2)}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center mb-4">
              {statusOrder.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={`h-2 rounded-full transition-all duration-300 ${i <= statusIndex ? "bg-green-500" : "bg-gray-300"}`} />
                  <p className="text-xs text-center mt-1">{s}</p>
                </div>
              ))}
            </div>

            {/* Products */}
            <div className="space-y-3 mb-3">
              {order.products?.map((item) => (
                <div key={item._id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center">
                    <img src={item.product?.image} alt={item.product?.name} className="w-20 h-20 object-cover rounded mr-4" />
                    <div>
                      <p className="font-semibold">{item.product?.name}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: ${item.product?.price?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery info */}
            <div className="mt-3">
              <p>
                <span className="font-semibold">Delivery:</span>{" "}
                {order.deliveryType === "home" ? (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">Home Delivery</span>
                ) : (
                  <span className="inline-flex items-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Pickup</span>
                    {order.pickup?.pickTime && (
                      <span className="ml-3 text-sm text-gray-800 font-medium">{new Date(order.pickup.pickTime).toLocaleString()}</span>
                    )}
                  </span>
                )}
              </p>

              {order.deliveryType === "home" && order.address && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  <div>{order.address.line1}</div>
                  <div>
                    {order.address.city}
                    {order.address.state ? ", " + order.address.state : ""} {order.address.postalCode}
                  </div>
                  {order.address.phone && <div>Phone: {order.address.phone}</div>}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-3">Order ID: {order._id}</p>

            {/* Cancel button for eligible orders */}
            {order.status === "pending" && (
              <div className="mt-3 text-right">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to cancel this order?")) {
                      dispatch(asyncCancelOrder(order._id));
                    }
                  }}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


