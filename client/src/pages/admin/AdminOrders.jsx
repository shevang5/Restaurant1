import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "../../api/config";
import { Bike, CalendarDays, CheckCircle2, Clock3, Filter, MapPin, Package, Plus, Search, ShoppingBag, Truck, Volume2, VolumeX, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", className: "bg-violet-100 text-violet-800" },
  delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", className: "bg-rose-100 text-rose-800" },
};
const COLUMNS = [
  { id: "paid", title: "Paid orders", icon: CheckCircle2, accent: "border-emerald-400", iconClass: "text-emerald-700 bg-emerald-50" },
  { id: "pending", title: "Pending orders", icon: Clock3, accent: "border-amber-400", iconClass: "text-amber-700 bg-amber-50" },
  { id: "shipped", title: "Shipped orders", icon: Truck, accent: "border-violet-400", iconClass: "text-violet-700 bg-violet-50" },
  { id: "delivered", title: "Delivered orders", icon: ShoppingBag, accent: "border-blue-400", iconClass: "text-blue-700 bg-blue-50" },
  { id: "cancelled", title: "Cancelled orders", icon: XCircle, accent: "border-rose-400", iconClass: "text-rose-700 bg-rose-50" },
];
const getColumn = (order) => {
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "delivered") return "delivered";
  if (!order.isPaid || order.status === "pending") return "pending";
  if (order.status === "shipped") return "shipped";
  return "paid";
};
const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const getOrderCardStyle = (order) => {
  if (order.status === "cancelled") return "border-rose-200 bg-rose-50";
  if (order.status === "delivered") return "border-emerald-200 bg-emerald-50";
  if (!order.isPaid) return "border-amber-200 bg-amber-50";
  return order.deliveryType === "home" ? "border-sky-200 bg-sky-50" : "border-emerald-200 bg-emerald-50";
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);
  const audioContextRef = useRef(null);
  const cashRegisterAudioRef = useRef(null);
  const seenOrderIdsRef = useRef(new Set());
  const getSocketUrl = () => (import.meta.env.VITE_SERVER_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("/orders");
      data.forEach((order) => seenOrderIdsRef.current.add(String(order._id)));
      setOrders([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleOrderSounds = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (soundEnabledRef.current) {
      if (audioContextRef.current) await audioContextRef.current.suspend();
      soundEnabledRef.current = false;
      setSoundEnabled(false);
    } else {
      if (AudioContextClass && !audioContextRef.current) audioContextRef.current = new AudioContextClass();
      if (audioContextRef.current) await audioContextRef.current.resume();
      if (!cashRegisterAudioRef.current) {
        cashRegisterAudioRef.current = new Audio("/sounds/cash-register.mp3");
        cashRegisterAudioRef.current.preload = "auto";
      }
      const cashAudio = cashRegisterAudioRef.current;
      cashAudio.muted = true;
      try {
        await cashAudio.play();
        cashAudio.pause();
        cashAudio.currentTime = 0;
      } catch (error) {
        console.warn("Could not unlock order notification audio", error);
      }
      cashAudio.muted = false;
      soundEnabledRef.current = true;
      setSoundEnabled(true);
    }
  };

  const playOrderSound = (isPaid) => {
    if (!soundEnabledRef.current) return;
    if (isPaid) {
      if (!cashRegisterAudioRef.current) cashRegisterAudioRef.current = new Audio("/sounds/cash-register.mp3");
      const cashAudio = cashRegisterAudioRef.current;
      cashAudio.currentTime = 0;
      cashAudio.volume = 0.8;
      cashAudio.play().catch((error) => console.warn("Could not play paid order sound", error));
      return;
    }
    const context = audioContextRef.current;
    if (!context) return;
    if (context.state !== "running") {
      context.resume().then(() => playOrderSound(false)).catch(() => {});
      return;
    }
    const now = context.currentTime;
    const tone = (frequency, offset, duration, type = "sine", volume = 0.13) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + offset;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    };

    // A clear two-note ding for unpaid/offline orders.
    tone(1046, 0, 0.42, "sine", 0.24);
    tone(1318, 0.12, 0.48, "sine", 0.2);
  };

  useEffect(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !audioContextRef.current) audioContextRef.current = new AudioContextClass();
    if (audioContextRef.current?.state === "suspended") audioContextRef.current.resume().catch(() => {});
    if (!cashRegisterAudioRef.current) {
      cashRegisterAudioRef.current = new Audio("/sounds/cash-register.mp3");
      cashRegisterAudioRef.current.preload = "auto";
    }

    const unlockAudio = () => {
      if (audioContextRef.current?.state === "suspended") audioContextRef.current.resume().catch(() => {});
      const audio = cashRegisterAudioRef.current;
      if (audio && audio.paused) {
        audio.muted = true;
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        }).catch(() => { audio.muted = false; });
      }
    };
    document.addEventListener("pointerdown", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    let socket;
    let active = true;
    fetchOrders().then(() => {
        if (!active) return;
        socket = io(getSocketUrl(), { withCredentials: true });
        socket.on("order:refresh", (incomingOrder) => {
          if (incomingOrder?._id) {
            const id = String(incomingOrder._id);
            if (!seenOrderIdsRef.current.has(id)) {
              seenOrderIdsRef.current.add(id);
              playOrderSound(Boolean(incomingOrder.isPaid));
            }
          }
          fetchOrders();
        });
      })
      .catch((err) => console.error("Failed to load order updates", err));
    return () => { active = false; socket?.disconnect(); };
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/orders/${orderId}/status`, { status });
      setOrders((previous) => previous.map((order) => order._id === orderId ? data : order));
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const groupedOrders = useMemo(() => {
    const groups = Object.fromEntries(COLUMNS.map(({ id }) => [id, []]));
    const query = searchTerm.trim().toLowerCase();
    orders.forEach((order) => {
      const name = order.user?.name || order.customerDetails?.name || "Guest customer";
      const matchesQuery = !query || String(order._id).toLowerCase().includes(query) || name.toLowerCase().includes(query);
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      const column = getColumn(order);
      if (column && matchesQuery && matchesStatus) groups[column].push(order);
    });
    return groups;
  }, [orders, searchTerm, filterStatus]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" /></div>;

  const detailAction = selectedOrder ? {
    label: selectedOrder.status === "delivered" ? "Reopen" : "Restore",
    value: selectedOrder.isPaid ? "processing" : "pending",
    style: "border-blue-200 text-blue-700 hover:bg-blue-50",
    confirmation: `This will return the order to ${selectedOrder.isPaid ? "Processing" : "Pending"}.`,
  } : null;

  return <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5">
    <header className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-4">
      <h1 className="shrink-0 text-lg font-bold text-slate-900">Order management</h1>
      <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg bg-slate-50 px-2.5"><Search size={16} className="shrink-0 text-slate-400"/><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search order ID or customer" className="w-full bg-transparent py-2 text-xs outline-none placeholder:text-slate-400"/></label>
      <label className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 text-slate-500"><Filter size={14}/><select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="min-w-28 bg-transparent py-2 text-xs text-slate-700 outline-none"><option value="all">All statuses</option>{Object.entries(STATUS_CONFIG).map(([status, config]) => <option key={status} value={status}>{config.label}</option>)}</select></label>
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2"><button onClick={toggleOrderSounds} aria-pressed={soundEnabled} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${soundEnabled ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{soundEnabled ? <Volume2 size={15}/> : <VolumeX size={15}/>} {soundEnabled ? "Sounds on" : "Enable sounds"}</button><Link to="/admin/create-order" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"><Plus size={15}/>Create manual order</Link></div>
    </header>

    <section className="admin-orders-board grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {COLUMNS.map(({ id, title, icon: Icon, accent, iconClass }, columnIndex) => <div key={id} style={{ "--card-index": columnIndex }} className={`admin-order-column min-w-0 overflow-hidden rounded-2xl border border-slate-200 border-t-4 ${accent} bg-slate-100/70 xl:flex xl:h-[calc(100vh-180px)] xl:flex-col`}>
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4"><div className="flex min-w-0 items-center gap-2"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconClass}`}><Icon size={17}/></span><h2 className="truncate text-sm font-bold text-slate-800">{title}</h2></div><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">{groupedOrders[id].length}</span></div>
        <div className="min-h-36 space-y-2 overflow-y-auto px-2 pb-3 sm:px-3 xl:min-h-0 xl:flex-1">
          {groupedOrders[id].length ? groupedOrders[id].map((order, cardIndex) => {
            const customer = order.user?.name || order.customerDetails?.name || "Guest customer";
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isTerminal = order.status === "delivered" || order.status === "cancelled";
            const statusLabel = order.status === "delivered" && order.deliveryType !== "home" ? "Collected" : status.label;
            const actions = isTerminal
              ? [{ label: order.status === "delivered" ? "Reopen" : "Restore", value: order.isPaid ? "processing" : "pending", style: "border-blue-200 text-blue-700 hover:bg-blue-50", confirmation: `This will return the order to ${order.isPaid ? "Processing" : "Pending"}.` }]
              : order.deliveryType === "home"
                ? [{ label: "Shipped", value: "shipped", style: "border-violet-200 text-violet-700 hover:bg-violet-50" }, { label: "Delivered", value: "delivered", style: "border-emerald-200 text-emerald-700 hover:bg-emerald-50" }, { label: "Cancel", value: "cancelled", style: "border-rose-200 text-rose-700 hover:bg-rose-50" }]
                : [{ label: "Collected", value: "delivered", style: "border-emerald-200 text-emerald-700 hover:bg-emerald-50" }, { label: "Cancel", value: "cancelled", style: "border-rose-200 text-rose-700 hover:bg-rose-50" }];
            if (isTerminal) return <article key={order._id} role="button" tabIndex={0} onClick={() => setSelectedOrder(order)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedOrder(order); } }} aria-label={`View order ${String(order._id).slice(-6).toUpperCase()} for ${customer}`} style={{ "--card-index": cardIndex }} className={`admin-order-card cursor-pointer overflow-hidden rounded-xl border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${getOrderCardStyle(order)}`}>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{customer}</p><p className="mt-0.5 text-[10px] font-semibold tracking-wide text-slate-500">#{String(order._id).slice(-6).toUpperCase()}</p></div><p className="shrink-0 text-base font-extrabold text-slate-900">{formatMoney(order.total)}</p></div>
              <div className="space-y-1.5 px-3 pb-2.5">{order.products?.slice(0, 2).map((item) => <div key={item._id} className="flex min-w-0 items-center gap-2 text-xs text-slate-700"><img src={item.product?.image} alt="" className="h-6 w-6 shrink-0 rounded object-cover ring-1 ring-slate-200"/><span className="min-w-0 truncate">{item.quantity}× {item.product?.name || "Menu item"}</span></div>)}{order.products?.length > 2 && <p className="pl-8 text-[11px] text-slate-500">+{order.products.length - 2} more items</p>}</div>
            </article>;
            return <article key={order._id} style={{ "--card-index": cardIndex }} className={`admin-order-card overflow-hidden rounded-xl border shadow-sm ${getOrderCardStyle(order)}`}>
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 px-3 py-3"><div className="min-w-0"><p className="truncate text-lg font-bold leading-tight text-slate-900">{customer}</p><p className="mt-1 text-xs font-medium text-slate-600">{order.isPaid ? "Paid online" : "Payment pending"}</p></div><p className="shrink-0 text-right text-xl font-extrabold leading-tight text-slate-900">{formatMoney(order.total)}<span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500">Total</span></p></div>
              <div className="space-y-2.5 p-3"><div className="flex items-center justify-between gap-2 text-xs text-slate-600"><span className="flex min-w-0 items-center gap-1.5">{order.deliveryType === "home" ? <Bike size={14}/> : <ShoppingBag size={14}/>}<span className="truncate">{order.deliveryType === "home" ? "Home delivery" : "Pickup"}</span></span><span className="flex shrink-0 items-center gap-1"><CalendarDays size={13}/>{new Date(order.createdAt).toLocaleDateString()}</span></div>
                {order.deliveryType === "home" && order.address?.line1 && <p className="flex items-start gap-1.5 text-xs text-slate-600"><MapPin size={13} className="mt-0.5 shrink-0"/><span className="line-clamp-2">{order.address.line1}{order.address.city ? `, ${order.address.city}` : ""}</span></p>}
                <div className="border-t border-slate-200/70 pt-2"><p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><Package size={13}/>Items</p><div className="space-y-1.5">{order.products?.slice(0, 3).map((item) => <div key={item._id} className="flex min-w-0 items-center justify-between gap-2 text-xs text-slate-700"><span className="flex min-w-0 items-center gap-2"><img src={item.product?.image} alt="" className="h-7 w-7 shrink-0 rounded-md bg-white object-cover ring-1 ring-slate-200"/><span className="truncate">{item.quantity}× {item.product?.name || "Menu item"}</span></span><span className="shrink-0">{formatMoney(item.quantity * (item.price || item.product?.price))}</span></div>)}{order.products?.length > 3 && <p className="text-[11px] text-slate-500">+{order.products.length - 3} more items</p>}</div></div>
                <div className="flex flex-nowrap items-center gap-1.5 border-t border-slate-200/70 pt-2"><div className="flex min-w-0 flex-1 items-center gap-1.5"><span className={`shrink-0 rounded-full px-1.5 py-1 text-[9px] font-semibold ${status.className}`}>{statusLabel}</span><span className="min-w-0 truncate text-[9px] font-semibold tracking-wide text-slate-600">#{String(order._id).slice(-6).toUpperCase()}</span></div><div className="flex shrink-0 flex-nowrap gap-1">{actions.map((action) => <button key={action.label} onClick={() => setConfirmAction({ order, action })} className={`admin-order-action whitespace-nowrap rounded-md border bg-white/80 px-1.5 py-1 text-[9px] font-semibold transition sm:px-2 ${action.style}`}>{action.label}</button>)}</div></div>
              </div>
            </article>;
          }) : <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-8 text-center"><div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white text-slate-400"><Clock3 size={17}/></div><p className="mt-2 text-xs font-medium text-slate-500">No {id} orders</p></div>}
        </div>
      </div>)}
    </section>
    {selectedOrder && <div className="admin-order-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}><section role="dialog" aria-modal="true" aria-labelledby="order-details-title" className="admin-order-dialog max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Order #{String(selectedOrder._id).slice(-6).toUpperCase()}</p><h2 id="order-details-title" className="mt-1 text-xl font-bold text-slate-900">{selectedOrder.user?.name || selectedOrder.customerDetails?.name || "Guest customer"}</h2></div><button onClick={() => setSelectedOrder(null)} aria-label="Close order details" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button></div>
      <div className="mt-4 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CONFIG[selectedOrder.status]?.className}`}>{selectedOrder.status === "delivered" && selectedOrder.deliveryType !== "home" ? "Collected" : STATUS_CONFIG[selectedOrder.status]?.label}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{selectedOrder.isPaid ? "Paid online" : "Payment pending"}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{selectedOrder.deliveryType === "home" ? "Home delivery" : "Pickup"}</span></div>
      <p className="mt-3 text-sm text-slate-500">Placed {new Date(selectedOrder.createdAt).toLocaleString()}</p>
      {selectedOrder.deliveryType === "home" ? <p className="mt-3 text-sm text-slate-700">{selectedOrder.address?.line1}{selectedOrder.address?.city ? `, ${selectedOrder.address.city}` : ""}{selectedOrder.address?.phone ? ` · ${selectedOrder.address.phone}` : ""}</p> : selectedOrder.pickup?.phone && <p className="mt-3 text-sm text-slate-700">Pickup phone: {selectedOrder.pickup.phone}</p>}
      <div className="mt-4 space-y-2 border-y border-slate-100 py-4">{selectedOrder.products?.map((item) => <div key={item._id} className="flex items-center gap-3"><img src={item.product?.image} alt="" className="h-10 w-10 rounded-lg bg-slate-100 object-cover"/><p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{item.quantity}× {item.product?.name || "Menu item"}{item.portion ? ` · ${item.portion}` : ""}</p><span className="text-sm text-slate-600">{formatMoney(item.quantity * (item.price || item.product?.price))}</span></div>)}</div>
      <p className="mt-4 flex justify-between text-sm font-semibold text-slate-700"><span>Total</span><span className="text-lg text-slate-900">{formatMoney(selectedOrder.total)}</span></p>
      <div className="mt-5 flex justify-end gap-2"><button onClick={() => setSelectedOrder(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button><button onClick={() => setConfirmAction({ order: selectedOrder, action: detailAction })} className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{detailAction.label}</button></div>
    </section></div>}
    {confirmAction && <div className="admin-order-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmAction(null); }}><section role="dialog" aria-modal="true" aria-labelledby="order-action-title" className="admin-order-dialog w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"><h2 id="order-action-title" className="text-lg font-bold text-slate-900">Confirm {confirmAction.action.label.toLowerCase()}?</h2><p className="mt-2 text-sm leading-6 text-slate-600">{confirmAction.action.confirmation || (confirmAction.action.value === "cancelled" ? "This will cancel the order." : `This will mark the order as ${confirmAction.action.label.toLowerCase()}.`)}</p><p className="mt-2 text-xs text-slate-400">Order #{String(confirmAction.order._id).slice(-6).toUpperCase()} · {confirmAction.order.user?.name || confirmAction.order.customerDetails?.name || "Guest customer"}</p><div className="mt-5 flex justify-end gap-2"><button onClick={() => setConfirmAction(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Go back</button><button onClick={() => { const { order, action } = confirmAction; setConfirmAction(null); setSelectedOrder(null); handleStatusChange(order._id, action.value); }} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${confirmAction.action.value === "cancelled" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-700 hover:bg-emerald-800"}`}>Confirm</button></div></section></div>}
    <style>{`
      @media (min-width: 1280px) {
        .admin-orders-board { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.3fr) minmax(0, .9fr) minmax(0, .65fr) minmax(0, .65fr); }
      }
      @keyframes admin-order-enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes admin-order-fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes admin-order-pop { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .admin-order-column { animation: admin-order-enter .35s ease-out both; animation-delay: calc(var(--card-index, 0) * 55ms); }
      .admin-order-card { animation: admin-order-enter .32s ease-out both; animation-delay: calc(var(--card-index, 0) * 45ms); transition: transform .18s ease, box-shadow .18s ease; }
      .admin-order-card:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgb(15 23 42 / .08); }
      .admin-order-action { transition: transform .15s ease, background-color .15s ease, box-shadow .15s ease; }
      .admin-order-action:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgb(15 23 42 / .1); }
      .admin-order-backdrop { animation: admin-order-fade .16s ease-out both; }
      .admin-order-dialog { animation: admin-order-pop .2s ease-out both; }
      @media (prefers-reduced-motion: reduce) { .admin-order-column, .admin-order-card, .admin-order-backdrop, .admin-order-dialog { animation: none; } .admin-order-card, .admin-order-action { transition: none; } }
    `}</style>
  </div>;
}
