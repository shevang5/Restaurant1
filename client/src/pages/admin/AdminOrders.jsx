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
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    btn: "bg-purple-500 hover:bg-purple-600"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    btn: "bg-green-500 hover:bg-green-600"
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

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      const sorted = [...data].sort((a, b) => {
        // Priority 1: Paid Online orders
        if (a.isPaid && !b.isPaid) return -1;
        if (!a.isPaid && b.isPaid) return 1;

        // Priority 2: Pending orders
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;

        // Newest first
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
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err) {
      alert("❌ Failed to update status");
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
            <p className="text-gray-500 mt-1">
              Manage and track customer orders efficiently
            </p>
          </div>
          <Link
            to="/admin/create-order"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* Reduced gap from 6 to 4 */}
            {filteredOrders.map((order) => {
              const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
              const isPending = order.status === "pending";

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-xl border transition-all duration-300 hover:shadow-md ${isPending
                    ? "border-red-600 border-2 shadow-red-100/50 ring-1 ring-red-100"
                    : order.isPaid
                      ? "border-green-600 border-2 shadow-green-100/50"
                      : "border-gray-100 shadow-sm"
                    }`}
                >
                  {/* Order Header */}
                  <div className="p-3 border-b border-gray-100 flex flex-row md:flex-row md:items-center justify-between gap-2 bg-gray-50/30 rounded-t-xl"> {/* Reduced padding and gap */}
                    <div className="flex items-center gap-2"> {/* Reduced gap */}
                      <div className={`p-1.5 rounded-lg ${STATUS_CONFIG[order.status]?.bg || "bg-gray-100"}`}> {/* Reduced padding and rounded size */}
                        <StatusIcon className={`w-4 h-4 ${STATUS_CONFIG[order.status]?.color || "text-gray-600"}`} /> {/* Reduced icon size */}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm"> {/* Reduced text size */}
                            #{order._id.slice(-6).toUpperCase()}
                          </h3>
                          <span className={`px-1.5 py-0 rounded-md text-[9px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[order.status]?.bg + " " + // Reduced padding and font size
                            STATUS_CONFIG[order.status]?.color + " " +
                            STATUS_CONFIG[order.status]?.border
                            }`}>
                            {STATUS_CONFIG[order.status]?.label}
                          </span>
                          {order.isPaid && (
                            <span className="px-1.5 py-0 rounded-md text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200 shadow-sm">
                              ✅ Paid Online
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"> {/* Reduced text size */}
                          <Clock className="w-2.5 h-2.5" /> {/* Reduced icon size */}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0">Total</p> {/* Removed margin-bottom */}
                      <p className="text-base font-bold text-gray-900">${order.total?.toFixed(2)}</p> {/* Reduced text size */}
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-3 flex flex-wrap gap-3"> {/* Reduced padding and gap */}
                    {/* Customer Info */}
                    <div className="space-y-1 flex-1 min-w-[45%]"> {/* Reduced space-y */}
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex  items-center gap-1"> {/* Reduced gap */}
                        <User className="w-3 h-3" /> Customer {/* Reduced icon size */}
                      </h4>
                      <div className="bg-gray-100 p-2 md:flex flex justify-between md:justify-between md:items-start rounded-lg space-y-1 text-sm h-[80px]"> {/* Reduced padding */}
                        <p className="font-bold text-gray-900 text-base leading-snug"> {/* Reduced text size and line height */}
                          {order.user?.name || order.customerDetails?.name || "Guest User"}
                        </p>
                        {/* {order.customerDetails?.phone && (
                          <p className="text-gray-600 flex items-center gap-1 text-xs"> 
                            <Phone className="w-3 h-3" /> {order.customerDetails.phone}
                          </p>
                        )} */}
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 md:h-full h-[30px] rounded border text-[12px] md:text-[20px] font-bold mt-1 ${order.deliveryType === "home"
                          ? "bg-amber-100 border-amber-200 text-amber-800"
                          : "bg-green-100 border-green-200 text-green-800"
                          }`}>
                          {order.deliveryType === "home" ? "🏠 Delivery" : "🏪 Pickup"}
                        </div>
                      </div>
                    </div>

                    {/* Delivery/Pickup Info */}
                    <div className="space-y-1 flex-1 min-w-[45%]"> {/* Reduced space-y */}
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"> {/* Reduced gap */}
                        <MapPin className="w-3 h-3" /> {order.deliveryType === "home" ? "Address" : "Pickup"} {/* Reduced icon size */}
                      </h4>
                      <div className="bg-gray-50 p-2 rounded-lg space-y-1 text-sm h-[80px]"> {/* Reduced padding */}
                        {order.deliveryType === "home" && order.address ? (
                          <>
                            <p className="text-gray-900 text-sm font-medium leading-tight">{order.address.line1}</p>
                            <p className="text-[11px] text-gray-600 leading-tight"> {/* Reduced text size */}
                              {order.address.city}, {order.address.state}
                            </p>
                            {order.address.phone && (
                              <p className="text-gray-500 flex items-center gap-1 pt-1 border-t border-gray-200 mt-1 text-xl"> {/* Reduced gap and text size */}
                                <Phone className="w-4 h-4" /> {order.address.phone}
                              </p>
                            )}
                          </>
                        ) : order.pickup ? (
                          <>
                            <p className="text-gray-900 font-medium flex items-center gap-1.5 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" /> {/* Reduced icon size */}
                              {order.pickup.pickTime ? new Date(order.pickup.pickTime).toLocaleString() : "No time set"}
                            </p>
                            {order.pickup.phone && (
                              <p className="text-gray-600 flex items-center gap-1 text-xl"> {/* Reduced gap and text size */}
                                <Phone className="w-4 h-4" /> {order.pickup.phone}
                              </p>
                            )}
                          </>
                        ) : <span className="text-gray-400 italic text-xs">No details</span>}
                      </div>
                    </div>

                    {/* Order Items - Full Width */}
                    <div className="space-y-1 w-full"> {/* Reduced space-y */}
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"> {/* Reduced gap */}
                        <Box className="w-3 h-3" /> Items {/* Reduced icon size */}
                      </h4>
                      <div className="bg-gray-50 p-1.5 rounded-lg flex flex-col flex-wrap gap-1.5"> {/* Reduced padding and gap */}
                        {order.products?.map((item) => (
                          <div key={item._id} className="flex  items-center gap-1.5 bg-white p-1 rounded border border-gray-100 shadow-sm min-w-[120px] flex-1"> {/* Reduced padding and gap, min-width */}
                            <img
                              src={item.product?.image}
                              alt={item.product?.name}
                              className="w-10 h-10 object-cover rounded bg-gray-100" // Reduced image size
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-medium text-gray-900 truncate">{item.product?.name}</p> {/* Reduced text size */}
                              <p className="text-[12px] text-gray-500">Qty: {item.quantity}</p> {/* Reduced text size */}
                            </div>
                            <p className="text-xs font-semibold text-gray-900">
                              ${(item.quantity * item.product?.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 rounded-b-xl flex flex-wrap gap-2 items-center justify-between"> {/* Reduced padding and rounded size */}
                    <span className="text-xs font-semibold text-gray-500 uppercase">Update Status:</span>
                    <div className="flex flex-wrap gap-1.5"> {/* Reduced gap */}
                      {Object.keys(STATUS_CONFIG).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order._id, status)}
                          disabled={order.status === status}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1 ${order.status === status // Reduced padding, rounded size, font size, and gap
                            ? "bg-gray-800 text-white cursor-default ring-0"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                            }`}
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
