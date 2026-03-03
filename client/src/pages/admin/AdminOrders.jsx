import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/config";
import {
  Search,
  Plus,
  MapPin,
  Phone,
  Calendar,
  User,
  Box,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from "lucide-react";

// Status Configuration
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    btn: "bg-amber-500 hover:bg-amber-600"
  },
  processing: {
    label: "Processing",
    icon: Box,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    btn: "bg-blue-500 hover:bg-blue-600"
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    btn: "bg-violet-500 hover:bg-violet-600"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "",
    btn: "bg-gray-500 hover:bg-gray-600"
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    btn: "bg-red-500 hover:bg-red-600"
  },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getSocketUrl = () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    if (serverUrl) {
      return serverUrl.replace(/\/api\/?$/, "");
    }
    return "http://localhost:5000";
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      const sorted = [...data].sort((a, b) => {
        // compute a priority weight where certain statuses always win
        // ensure delivered and shipped are placed at the bottom regardless of payment
        const priority = (o) => {
          // status-based buckets take absolute precedence
          if (o.status === "delivered") return 4; // always last
          if (o.status === "shipped") return 3; // second last

          // then paid orders should appear first
          if (o.isPaid) return 0; // paid orders first

          // pending should come after paid
          if (o.status === "pending") return 1;

          // processing (or other in-flight statuses)
          if (o.status === "processing") return 2;

          // any other status (cancelled, etc.) placed before delivered
          return 5;
        };

        const pa = priority(a);
        const pb = priority(b);
        if (pa !== pb) return pa - pb;

        // same priority: newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(sorted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // use socket to refresh admin orders in real-time
    let socket;
    const setupSocket = async () => {
      try {
        const { io } = await import(
          "https://cdn.socket.io/4.6.1/socket.io.esm.min.js"
        );
        socket = io(getSocketUrl(), {
          withCredentials: true,
        });

        socket.on("order:refresh", () => {
          fetchOrders();
        });
      } catch (err) {
        console.error("Failed to load socket.io client:", err);
      }
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.off("order:refresh");
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || order.customerDetails?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Box className="w-8 h-8 text-red-600" />
              Order Management
            </h1>
            <p className="text-gray-500 mt-1">Manage and track customer orders efficiently</p>
          </div>
          <Link
            to="/admin/create-order"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create Manual Order
          </Link>
        </div>

        {/* Filters & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 bg-white p-2 rounded-xl border border-gray-200 flex items-center gap-2 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              className="w-full p-2 outline-none text-gray-700 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Filter className="w-4 h-4" />
            </div>
            <select
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 pl-10 pr-4 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {!filteredOrders.length ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Box className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
              const isPending = order.status === "pending";

              // card classes: delivered = no border, shipped = violet, processing = blue, pending = amber, paid = green
              const cardClass = order.status === "delivered"
                ? "bg-white rounded-xl shadow-sm"
                : order.status === "shipped"
                ? "bg-white rounded-xl border-violet-600 border-2 shadow-violet-100/50"
                : order.status === "processing"
                ? "bg-white rounded-xl border-blue-600 border-2 shadow-blue-100/50"
                : isPending
                ? "bg-white rounded-xl border-red-600 border-2 shadow-red-100/50 ring-1 ring-red-100"
                : order.isPaid
                ? "bg-white rounded-xl border-green-600 border-2 shadow-green-100/50"
                : "bg-white rounded-xl border-gray-100 shadow-sm";

              return (
                <div key={order._id} className={cardClass}>
                  {/* Order Header */}
                  <div className="p-3 border-b border-gray-100 flex flex-row md:flex-row md:items-center justify-between gap-2 bg-gray-50/30 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${STATUS_CONFIG[order.status]?.bg || "bg-gray-100"}`}>
                        <StatusIcon className={`w-4 h-4 ${STATUS_CONFIG[order.status]?.color || "text-gray-600"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm">#{order._id.slice(-6).toUpperCase()}</h3>
                          <span className={`px-1.5 py-0 rounded-md text-[9px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[order.status]?.bg + " " + STATUS_CONFIG[order.status]?.color + " " + STATUS_CONFIG[order.status]?.border}`}>
                            {STATUS_CONFIG[order.status]?.label}
                          </span>
                          {order.isPaid && (
                            <span className="px-1.5 py-0 rounded-md text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200 shadow-sm">
                              Paid Online
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0">Total</p>
                      <p className="text-base font-bold text-gray-900">₹{order.total?.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-3 flex flex-wrap gap-3">
                    {/* Customer Info */}
                    <div className="space-y-1 flex-1 min-w-[45%]">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3 h-3" /> Customer
                      </h4>
                      <div className="bg-gray-100 p-2 md:flex justify-between md:items-start rounded-lg space-y-1 text-sm h-[80px]">
                        <p className="font-bold text-gray-900 text-base leading-snug">{order.user?.name || order.customerDetails?.name || "Guest User"}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 md:h-full h-[30px] rounded border text-[12px] md:text-[20px] font-bold mt-1 ${order.deliveryType === "home" ? "bg-amber-100 border-amber-200 text-amber-800" : "bg-green-100 border-green-200 text-green-800"}`}>
                          {order.deliveryType === "home" ? "Home Delivery" : "Pickup"}
                        </div>
                      </div>
                    </div>

                    {/* Delivery/Pickup Info */}
                    <div className="space-y-1 flex-1 min-w-[45%]">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.deliveryType === "home" ? "Address" : "Pickup"}
                      </h4>
                      <div className="bg-gray-50 p-2 rounded-lg space-y-1 text-sm h-[80px]">
                        {order.deliveryType === "home" && order.address ? (
                          <>
                            <p className="text-gray-900 text-sm font-medium leading-tight">{order.address.line1}</p>
                            <p className="text-[11px] text-gray-600 leading-tight">{order.address.city}, {order.address.state}</p>
                            {order.address.phone && (<p className="text-gray-500 flex items-center gap-1 pt-1 border-t border-gray-200 mt-1 text-xl"><Phone className="w-4 h-4" /> {order.address.phone}</p>)}
                          </>
                        ) : order.pickup ? (
                          <>
                            <p className="text-gray-900 font-medium flex items-center gap-1.5 text-sm"><Calendar className="w-4 h-4 text-gray-500" />{order.pickup.pickTime ? new Date(order.pickup.pickTime).toLocaleString() : "No time set"}</p>
                            {order.pickup.phone && (<p className="text-gray-600 flex items-center gap-1 text-xl"><Phone className="w-4 h-4" /> {order.pickup.phone}</p>)}
                          </>
                        ) : <span className="text-gray-400 italic text-xs">No details</span>}
                      </div>
                    </div>

                    {/* Order Items - Full Width */}
                    <div className="space-y-1 w-full">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"><Box className="w-3 h-3" /> Items</h4>
                      <div className="bg-gray-50 p-1.5 rounded-lg flex flex-col flex-wrap gap-1.5">
                        {order.products?.map((item) => (
                          <div key={item._id} className="flex items-center gap-1.5 bg-white p-1 rounded border border-gray-100 shadow-sm min-w-[120px] flex-1">
                            <img src={item.product?.image} alt={item.product?.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-[15px] font-medium text-gray-900 truncate">{item.product?.name}</p>
                                {item.portion && (<span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${item.portion === "half" ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-blue-100 text-blue-700 border border-blue-200"}`}>{item.portion === "half" ? "Half" : "Full"}</span>)}
                              </div>
                              <p className="text-[12px] text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-xs font-semibold text-gray-900">₹{(item.quantity * (item.price || item.product?.price)).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 rounded-b-xl flex flex-wrap gap-2 items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Update Status:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.keys(STATUS_CONFIG).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order._id, status)}
                          disabled={order.status === status}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1 ${order.status === status ? "bg-gray-800 text-white cursor-default ring-0" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"}`}
                        >
                          {order.status === status && <CheckCircle className="w-3 h-3" />}
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
      `}</style>
    </div>
  );
}
