import { createElement, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CalendarDays, Download, FileText, ShoppingBag, Users } from "lucide-react";

const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const toMonthValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const getUserKey = (order) => order.user?._id || order.user?.id || order.user?.email || null;

export default function AdminMonthlyReport() {
  const loadedOrders = useSelector((state) => state.orders?.orders);
  const orders = useMemo(() => Array.isArray(loadedOrders) ? loadedOrders : [], [loadedOrders]);
  const [month, setMonth] = useState(() => toMonthValue(new Date()));
  const { summary, title } = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    const start = new Date(year, monthNumber - 1, 1);
    const end = new Date(year, monthNumber, 1);
    const inMonth = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return created >= start && created < end;
    });
    const fulfilled = inMonth.filter((order) => order.status === "delivered");
    const countType = (type, paid) => inMonth.filter((order) => order.deliveryType === type && Boolean(order.isPaid) === paid).length;

    const firstOrderByCustomer = new Map();
    orders.forEach((order) => {
      const key = getUserKey(order);
      if (!key) return;
      const created = new Date(order.createdAt);
      const previous = firstOrderByCustomer.get(String(key));
      if (!previous || created < previous) firstOrderByCustomer.set(String(key), created);
    });

    const activeCustomerKeys = new Set(inMonth.map(getUserKey).filter(Boolean).map(String));
    const newCustomerCount = [...firstOrderByCustomer.entries()].filter(([, date]) => date >= start && date < end).length;
    return {
      title: start.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      summary: {
        revenue: fulfilled.reduce((sum, order) => sum + Number(order.total || 0), 0),
        orders: inMonth.length,
        homeOnline: countType("home", true),
        homeOffline: countType("home", false),
        pickupOnline: countType("pickup", true),
        pickupOffline: countType("pickup", false),
        customers: activeCustomerKeys.size,
        newCustomers: newCustomerCount,
      },
    };
  }, [orders, month]);

  const metrics = [
    { label: "Revenue from delivered orders", value: formatMoney(summary.revenue), IconComponent: FileText, tint: "bg-emerald-50 text-emerald-700" },
    { label: "Total orders", value: summary.orders, IconComponent: ShoppingBag, tint: "bg-orange-50 text-orange-700" },
    { label: "Customers this month", value: summary.customers, IconComponent: Users, tint: "bg-blue-50 text-blue-700" },
    { label: "New customers", value: summary.newCustomers, IconComponent: Users, tint: "bg-violet-50 text-violet-700" },
  ];

  return <div className="mx-auto max-w-6xl space-y-6">
    <style>{`@media print { @page { size: A4; margin: 14mm; } body * { visibility: hidden !important; } #monthly-report, #monthly-report * { visibility: visible !important; } #monthly-report { position: absolute; inset: 0 auto auto 0; width: 100%; max-width: none; margin: 0; padding: 0; } .no-print { display: none !important; } }`}</style>
    <header className="no-print flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-medium text-orange-700">Reports</p><h1 className="mt-1 text-3xl font-bold">Monthly report</h1><p className="mt-2 text-sm text-slate-500">Review order, payment, revenue, and customer totals.</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"><CalendarDays size={16} className="text-slate-500"/><span className="sr-only">Select report month</span><input aria-label="Report month" type="month" value={month} max={toMonthValue(new Date())} onChange={(event) => setMonth(event.target.value)} className="bg-transparent outline-none"/></label>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"><Download size={16}/>Download PDF</button>
      </div>
    </header>

    <section id="monthly-report" className="space-y-6 rounded-2xl bg-transparent print:bg-white">
      <div className="hidden border-b border-slate-200 pb-4 print:block"><p className="text-sm font-semibold uppercase tracking-widest text-orange-700">Restaurant · Monthly report</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, IconComponent, tint }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid"><div className="flex items-center justify-between gap-3"><span className="text-sm text-slate-500">{label}</span><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tint}`}>{createElement(IconComponent, { size: 19 })}</span></div><p className="mt-5 text-3xl font-bold text-slate-900">{value}</p></article>)}</div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">Orders by fulfillment and payment</h2><p className="mt-1 text-xs text-slate-500">Online means marked paid online. Offline includes orders not marked as online paid.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Order type</th><th className="px-5 py-3">Online payment</th><th className="px-5 py-3">Offline / unpaid</th><th className="px-5 py-3">Total</th></tr></thead><tbody className="divide-y divide-slate-100"><tr><td className="px-5 py-4 font-medium">Home delivery</td><td className="px-5 py-4">{summary.homeOnline}</td><td className="px-5 py-4">{summary.homeOffline}</td><td className="px-5 py-4 font-semibold">{summary.homeOnline + summary.homeOffline}</td></tr><tr><td className="px-5 py-4 font-medium">Pickup</td><td className="px-5 py-4">{summary.pickupOnline}</td><td className="px-5 py-4">{summary.pickupOffline}</td><td className="px-5 py-4 font-semibold">{summary.pickupOnline + summary.pickupOffline}</td></tr><tr className="bg-slate-50 font-bold"><td className="px-5 py-4">All orders</td><td className="px-5 py-4">{summary.homeOnline + summary.pickupOnline}</td><td className="px-5 py-4">{summary.homeOffline + summary.pickupOffline}</td><td className="px-5 py-4">{summary.orders}</td></tr></tbody></table></div></section>
      <p className="text-xs leading-5 text-slate-500">Revenue totals delivered orders in the selected month. Customer totals count registered customers with an order in that month; new customers are those whose first recorded order was in that month. Guest/manual orders are included in order totals but excluded from customer counts.</p>
    </section>
  </div>;
}
