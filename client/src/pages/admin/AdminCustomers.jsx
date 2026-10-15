import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Bike, Sparkles, Store, Users } from "lucide-react";

export default function AdminCustomers() {
  const orders = useSelector((state) => state.orders.orders) || [];
  const customers = useMemo(() => {
    const grouped = new Map();
    orders.forEach((order) => {
      const user = order.user;
      if (!user?._id) return;
      const key = String(user._id);
      const customer = grouped.get(key) || { id: key, name: user.name || "Customer", email: user.email || "", total: 0, pickup: 0, home: 0, joined: user.createdAt || order.createdAt };
      customer.total++;
      if (order.deliveryType === "home") customer.home++; else customer.pickup++;
      if (new Date(order.createdAt) < new Date(customer.joined)) customer.joined = order.createdAt;
      grouped.set(key, customer);
    });
    return [...grouped.values()];
  }, [orders]);
  const topPickup = [...customers].sort((a, b) => b.pickup - a.pickup)[0];
  const topHome = [...customers].sort((a, b) => b.home - a.home)[0];
  const newest = [...customers].sort((a, b) => new Date(b.joined) - new Date(a.joined))[0];
  const highlights = [
    { label: "New customer", person: newest, note: "Most recently joined", icon: Sparkles, color: "text-violet-700 bg-violet-50" },
    { label: "Top pickup customer", person: topPickup, note: `${topPickup?.pickup || 0} pickup orders`, icon: Store, color: "text-blue-700 bg-blue-50" },
    { label: "Top home delivery", person: topHome, note: `${topHome?.home || 0} delivery orders`, icon: Bike, color: "text-amber-700 bg-amber-50" },
  ];
  return <div className="mx-auto max-w-6xl space-y-7"><header><p className="text-sm font-medium text-emerald-700">Relationships</p><h1 className="mt-1 text-3xl font-bold">Customers</h1><p className="mt-2 text-sm text-slate-500">Your most active customers, based on recorded orders.</p></header>
    <section className="grid gap-4 md:grid-cols-3">{highlights.map(({ label, person, note, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={19}/></span><span className="text-sm text-slate-500">{label}</span></div><p className="mt-5 text-xl font-bold">{person?.name || "No customer data"}</p><p className="mt-1 text-sm text-slate-500">{person ? note : "Customer order history will appear here"}</p></article>)}</section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">Customer list</h2><span className="flex items-center gap-2 text-sm text-slate-500"><Users size={16}/>{customers.length} customers</span></div>{customers.length ? <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Orders</th><th className="px-5 py-3">Pickup</th><th className="px-5 py-3">Home delivery</th><th className="px-5 py-3">Joined</th></tr></thead><tbody className="divide-y divide-slate-100">{customers.sort((a,b)=>b.total-a.total).map((customer)=><tr key={customer.id}><td className="px-5 py-4"><p className="font-semibold">{customer.name}</p><p className="mt-1 text-xs text-slate-500">{customer.email}</p></td><td className="px-5 py-4">{customer.total}</td><td className="px-5 py-4">{customer.pickup}</td><td className="px-5 py-4">{customer.home}</td><td className="px-5 py-4 text-slate-500">{new Date(customer.joined).toLocaleDateString()}</td></tr>)}</tbody></table></div> : <div className="py-16 text-center text-sm text-slate-500">No registered customer orders found yet.</div>}</section>
  </div>;
}
