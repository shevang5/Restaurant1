import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Bike, CalendarDays, CircleDollarSign, ShoppingBag, XCircle } from "lucide-react";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function AdminAnalytics() {
  const orders = useSelector((state) => state.orders.orders) || [];
  const [period, setPeriod] = useState("today");
  const now = new Date();
  const today = startOfDay(now);
  const metrics = useMemo(() => ({
    pickup: orders.filter((o) => o.deliveryType === "pickup").length,
    delivery: orders.filter((o) => o.deliveryType === "home").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total || 0), 0),
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }), [orders]);
  const chart = useMemo(() => {
    let slots;
    let labels;
    let begin;
    if (period === "today") {
      slots = 12; begin = new Date(today); begin.setHours(now.getHours() - 11, 0, 0, 0);
      labels = Array.from({ length: slots }, (_, i) => new Date(begin.getTime() + i * 3600000).toLocaleTimeString([], { hour: "numeric" }));
    } else if (period === "week") {
      slots = 7; begin = new Date(today); begin.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      labels = Array.from({ length: slots }, (_, i) => new Date(begin.getTime() + i * 86400000).toLocaleDateString([], { weekday: "short" }));
    } else {
      begin = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      slots = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      labels = Array.from({ length: slots }, (_, i) => new Date(begin.getTime() + i * 86400000).toLocaleDateString([], { day: "numeric", month: "short" }));
    }
    const values = Array(slots).fill(0);
    orders.forEach((order) => {
      if (order.status === "cancelled") return;
      const date = new Date(order.createdAt);
      const index = period === "today" ? Math.floor((date - begin) / 3600000) : Math.floor((startOfDay(date) - begin) / 86400000);
      if (index >= 0 && index < slots) values[index] += Number(order.total || 0);
    });
    return { labels, values, max: Math.max(...values, 1) };
  }, [orders, period, now, today]);
  const cards = [
    { label: "Pickup orders", value: metrics.pickup, icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Home delivery", value: metrics.delivery, icon: Bike, color: "bg-amber-50 text-amber-700" },
    { label: "Total revenue", value: money(metrics.revenue), icon: CircleDollarSign, color: "bg-emerald-50 text-emerald-700" },
    { label: "Cancelled orders", value: metrics.cancelled, icon: XCircle, color: "bg-rose-50 text-rose-700" },
  ];
  return <div className="mx-auto max-w-6xl space-y-7">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium text-emerald-700">Overview</p><h1 className="mt-1 text-3xl font-bold">Analytics</h1><p className="mt-2 text-sm text-slate-500">Order and revenue performance at a glance.</p></div><div className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={17}/>{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div></header>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={20}/></span></div><p className="mt-5 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-400">All recorded orders</p></article>)}</section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Revenue trend</h2><p className="mt-1 text-sm text-slate-500">Revenue from non-cancelled orders</p></div><div className="flex rounded-xl bg-slate-100 p-1">{[["today", "Today"], ["week", "This week"], ["month", "Last month"]].map(([value, label]) => <button key={value} onClick={() => setPeriod(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{label}</button>)}</div></div>
      <div className="mt-8 flex h-64 items-end gap-1 border-b border-l border-slate-200 px-2 sm:gap-2">{chart.values.map((value, i) => <div key={i} title={`${chart.labels[i]}: ${money(value)}`} className="group relative flex h-full flex-1 items-end"><div className="w-full rounded-t-md bg-emerald-500/80 transition hover:bg-emerald-600" style={{ height: `${Math.max(value ? 5 : 1, (value / chart.max) * 100)}%` }} />{(period !== "month" || i % 5 === 0 || i === chart.labels.length - 1) && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-400">{chart.labels[i]}</span>}</div>)}</div>
      <div className="mt-10 flex items-center justify-between text-xs text-slate-400"><span>₹0</span><span>Hover over a bar to see revenue</span><span>{money(chart.max)}</span></div>
    </section>
  </div>;
}
