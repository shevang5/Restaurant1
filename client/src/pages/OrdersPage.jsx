import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bike, CalendarDays, Check, Clock3, MapPin, ShoppingBag, Store, XCircle } from "lucide-react";
import { asyncGetUserOrders, asyncCancelOrder } from "../store/action/orderActions";

const currency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const orderSteps = {
  home: [
    { status: "pending", label: "Placed" },
    { status: "processing", label: "Preparing" },
    { status: "shipped", label: "On the way" },
    { status: "delivered", label: "Delivered" },
  ],
  pickup: [
    { status: "pending", label: "Placed" },
    { status: "processing", label: "Preparing" },
    { status: "delivered", label: "Collected" },
  ],
};

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(asyncGetUserOrders());
  }, [dispatch]);

  if (loading) return <main className="mx-auto max-w-3xl px-4 py-10"><div className="animate-pulse space-y-4">{[0, 1].map((item) => <div key={item} className="h-52 rounded-2xl bg-slate-200" />)}</div></main>;

  const sortedOrders = [...(orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!sortedOrders.length) return <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-5 pb-10 text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-orange-100 text-orange-600"><ShoppingBag size={28}/></span><h1 className="mt-5 text-2xl font-extrabold text-slate-900">No orders yet</h1><p className="mt-2 text-sm text-slate-500">Your orders and their progress will appear here.</p><Link to="/products" className="mt-5 rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">Explore the menu</Link></main>;

  return <main className="mx-auto max-w-3xl px-4 py-6 pb-10 sm:px-6 sm:py-8">
    <header className="mb-6 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-orange-600">Your account</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">My orders</h1><p className="mt-1 text-sm text-slate-500">Track your recent orders and delivery status.</p></div><span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">{sortedOrders.length} {sortedOrders.length === 1 ? "order" : "orders"}</span></header>

    <div className="space-y-4">{sortedOrders.map((order) => {
      const isPickup = order.deliveryType !== "home";
      const steps = isPickup ? orderSteps.pickup : orderSteps.home;
      const statusIndex = steps.findIndex((step) => step.status === order.status);
      const isCancelled = order.status === "cancelled";
      const isDelivered = order.status === "delivered";
      const customerStatus = isPickup && isDelivered ? "Collected" : (order.status || "pending").replace(/^./, (letter) => letter.toUpperCase());

      return <article key={order._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 sm:px-5">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${isCancelled ? "bg-rose-50 text-rose-700" : isDelivered ? "bg-emerald-50 text-emerald-700" : order.status === "shipped" ? "bg-violet-50 text-violet-700" : order.status === "processing" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{isCancelled ? <XCircle size={13}/> : isDelivered ? <Check size={13}/> : order.status === "shipped" ? <Bike size={13}/> : <Clock3 size={13}/>} {customerStatus}</span><span className="text-[11px] font-medium text-slate-500">#{String(order._id).slice(-8).toUpperCase()}</span></div><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13}/>{order.createdAt ? new Date(order.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Order date unavailable"}</p></div>
          <div className="shrink-0 text-right"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total</p><p className="mt-0.5 text-lg font-extrabold tracking-tight text-slate-900">{currency(order.total)}</p><p className="mt-1 text-[10px] font-medium text-slate-500">{order.isPaid ? "Paid online" : "Pay on receipt"}</p></div>
        </div>

        {isCancelled ? <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700 sm:mx-5"><XCircle size={15}/> This order was cancelled.</div> : <div className="px-4 pt-4 sm:px-5"><div className="flex items-start">{steps.map((step, index) => <div key={step.status} className="flex min-w-0 flex-1 flex-col items-center"><div className="flex w-full items-center"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${index <= statusIndex ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>{index < statusIndex ? <Check size={13}/> : <span className="h-1.5 w-1.5 rounded-full bg-current"/>}</span>{index < steps.length - 1 && <span className={`h-1 flex-1 ${index < statusIndex ? "bg-orange-400" : "bg-slate-100"}`}/>}</div><span className={`mt-1.5 w-full truncate text-[10px] font-semibold ${index <= statusIndex ? "text-orange-700" : "text-slate-400"}`}>{step.label}</span></div>)}</div></div>}

        <div className="space-y-2 px-4 py-4 sm:px-5">{order.products?.map((item, index) => {
          const itemPrice = item.price ?? (item.portion === "half" ? item.product?.halfPlatePrice : item.product?.price) ?? item.product?.price;
          const quantity = Number(item.quantity || 1);
          return <div key={item._id || `${order._id}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-2.5">
            <img src={item.product?.image || "/images/bgImg.jpg"} alt={item.product?.name || "Ordered dish"} className="h-14 w-14 shrink-0 rounded-lg object-cover"/>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{item.product?.name || "Product"}<span className="font-medium text-slate-500">{item.portion ? ` · ${item.portion === "half" ? "Half" : "Full"}` : ""}</span></p><p className="mt-1 text-xs text-slate-500">Qty {quantity} · {currency(itemPrice)} each</p></div>
            <p className="shrink-0 text-sm font-bold text-slate-800">{currency(Number(itemPrice || 0) * quantity)}</p>
          </div>;
        })}</div>

        <div className="mx-4 mb-4 rounded-xl border border-slate-100 px-3.5 py-3 sm:mx-5">
          <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-xs font-semibold text-slate-600">{isPickup ? <Store size={15} className="text-orange-600"/> : <Bike size={16} className="text-orange-600"/>}{isPickup ? "Pickup" : "Home delivery"}</span><span className="text-right text-xs text-slate-500">{isPickup && order.pickup?.pickTime ? new Date(order.pickup.pickTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : ""}</span></div>
          {!isPickup && order.address && <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500"><MapPin size={14} className="mt-0.5 shrink-0 text-slate-400"/><span>{order.address.line1}{order.address.city ? `, ${order.address.city}` : ""}{order.address.state ? `, ${order.address.state}` : ""} {order.address.postalCode || ""}{order.address.phone ? ` · ${order.address.phone}` : ""}</span></p>}
        </div>

        {order.status === "pending" && <div className="flex justify-end border-t border-slate-100 px-4 py-3 sm:px-5"><button onClick={() => { if (window.confirm("Are you sure you want to cancel this order?")) dispatch(asyncCancelOrder(order._id)); }} className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50">Cancel order</button></div>}
      </article>;
    })}</div>
  </main>;
}
