import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/config";
import {
  Bike,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  Package,
  Plus,
  Search,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700" },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700" },
  shipped: { label: "Shipped", className: "bg-violet-50 text-violet-700" },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: { label: "Cancelled", className: "bg-rose-50 text-rose-700" },
};
const COLUMNS = [
  {
    id: "paid",
    title: "Paid orders",
    icon: CheckCircle2,
    accent: "border-emerald-400",
    iconClass: "text-emerald-700 bg-emerald-50",
  },
  {
    id: "pending",
    title: "Pending orders",
    icon: Clock3,
    accent: "border-amber-400",
    iconClass: "text-amber-700 bg-amber-50",
  },
  {
    id: "delivered",
    title: "Delivered orders",
    icon: ShoppingBag,
    accent: "border-blue-400",
    iconClass: "text-blue-700 bg-blue-50",
  },
  {
    id: "cancelled",
    title: "Cancelled orders",
    icon: XCircle,
    accent: "border-rose-400",
    iconClass: "text-rose-700 bg-rose-50",
  },
];
const getColumn = (order) => {
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "delivered") return "delivered";
  if (order.status === "pending") return "pending";
  if (order.isPaid) return "paid";
  return null;
};
const formatMoney = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const getSocketUrl = () =>
    (import.meta.env.VITE_SERVER_URL || "http://localhost:5000").replace(
      /\/api\/?$/,
      "",
    );

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("/orders");
      setOrders(
        [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    let socket;
    import("https://cdn.socket.io/4.6.1/socket.io.esm.min.js")
      .then(({ io }) => {
        socket = io(getSocketUrl(), { withCredentials: true });
        socket.on("order:refresh", fetchOrders);
      })
      .catch((err) => console.error("Failed to load order updates", err));
    return () => socket?.disconnect();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/orders/${orderId}/status`, { status });
      setOrders((previous) =>
        previous.map((order) => (order._id === orderId ? data : order)),
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Failed to update order status",
      );
    }
  };

  const groupedOrders = useMemo(() => {
    const groups = Object.fromEntries(COLUMNS.map(({ id }) => [id, []]));
    const query = searchTerm.trim().toLowerCase();
    orders.forEach((order) => {
      const name =
        order.user?.name || order.customerDetails?.name || "Guest customer";
      const matchesQuery =
        !query ||
        String(order._id).toLowerCase().includes(query) ||
        name.toLowerCase().includes(query);
      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;
      const column = getColumn(order);
      if (column && matchesQuery && matchesStatus) groups[column].push(order);
    });
    return groups;
  }, [orders, searchTerm, filterStatus]);

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
      </div>
    );

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Operations
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Order management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track each order from payment through delivery.
          </p>
        </div>
        <Link
          to="/admin/create-order"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        >
          <Plus size={17} />
          Create manual order
        </Link>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-3">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search order ID or customer"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-500">
          <Filter size={16} />
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="min-w-32 bg-transparent py-3 text-sm text-slate-700 outline-none"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="grid min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map(({ id, title, icon: Icon, accent, iconClass }) => (
          <div
            key={id}
            className={`min-w-0 overflow-hidden rounded-2xl border border-slate-200 border-t-4 ${accent} bg-slate-100/70`}
          >
            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconClass}`}
                >
                  <Icon size={17} />
                </span>
                <h2 className="truncate text-sm font-bold text-slate-800">
                  {title}
                </h2>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">
                {groupedOrders[id].length}
              </span>
            </div>
            <div className="max-h-[calc(100vh-290px)] min-h-36 space-y-3 overflow-y-auto px-2 pb-3 sm:px-3">
              {groupedOrders[id].length ? (
                groupedOrders[id].map((order) => {
                  const customer =
                    order.user?.name ||
                    order.customerDetails?.name ||
                    "Guest customer";
                  const status =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  return (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-3 py-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-400">
                            ORDER
                          </p>
                          <p className="mt-0.5 truncate font-bold text-slate-900">
                            #{String(order._id).slice(-6).toUpperCase()}
                          </p>
                        </div>
                        <p className="shrink-0 text-right text-sm font-bold text-slate-900">
                          {formatMoney(order.total)}
                          <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                            {order.isPaid ? "Paid online" : "Unpaid"}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2.5 p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <UserRound
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          <span className="truncate font-medium text-slate-800">
                            {customer}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <span className="shrink-0">
                              {order.deliveryType === "home" ? (
                                <Bike size={14} />
                              ) : (
                                <ShoppingBag size={14} />
                              )}
                            </span>
                            <span className="truncate">
                              {order.deliveryType === "home"
                                ? "Home delivery"
                                : "Pickup"}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1">
                            <CalendarDays size={13} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {order.deliveryType === "home" &&
                          order.address?.line1 && (
                            <p className="flex items-start gap-1.5 text-xs text-slate-500">
                              <MapPin size={13} className="mt-0.5 shrink-0" />
                              <span className="line-clamp-2">
                                {order.address.line1}
                                {order.address.city
                                  ? `, ${order.address.city}`
                                  : ""}
                              </span>
                            </p>
                          )}
                        <div className="border-t border-slate-100 pt-2">
                          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            <Package size={13} />
                            Items
                          </p>
                          <div className="space-y-1">
                            {order.products?.slice(0, 3).map((item) => (
                              <p
                                key={item._id}
                                className="flex justify-between gap-2 text-xs text-slate-600"
                              >
                                <span className="min-w-0 truncate">
                                  {item.quantity}×{" "}
                                  {item.product?.name || "Menu item"}
                                </span>
                                <span className="shrink-0">
                                  {formatMoney(
                                    item.quantity *
                                      (item.price || item.product?.price),
                                  )}
                                </span>
                              </p>
                            ))}
                            {order.products?.length > 3 && (
                              <p className="text-[11px] text-slate-400">
                                +{order.products.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                          <select
                            aria-label={`Update status for order ${String(order._id).slice(-6)}`}
                            value={order.status}
                            onChange={(event) =>
                              handleStatusChange(order._id, event.target.value)
                            }
                            className="max-w-32 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-emerald-500"
                          >
                            {Object.entries(STATUS_CONFIG).map(
                              ([value, config]) => (
                                <option key={value} value={value}>
                                  {config.label}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-8 text-center">
                  <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white text-slate-400">
                    <Clock3 size={17} />
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    No {id} orders
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
