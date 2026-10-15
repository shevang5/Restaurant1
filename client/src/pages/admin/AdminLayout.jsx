import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Activity, ChefHat, ClipboardList, LogOut, Settings, Users } from "lucide-react";
import { asyncGetAllOrders } from "../../store/action/orderActions";
import { asyncLogoutUsers } from "../../store/action/userActions";

const links = [
  { to: "/admin/orders", label: "Manage orders", icon: ClipboardList },
  { to: "/admin/menu", label: "Edit menu", icon: ChefHat },
  { to: "/admin/analytics", label: "Analytics", icon: Activity },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;
  const pending = useSelector((state) => state.orders.orders?.filter((order) => order.status === "pending").length || 0);

  useEffect(() => {
    if (user?.role === "admin") dispatch(asyncGetAllOrders());
  }, [dispatch, user?.role]);

  const logout = () => {
    dispatch(asyncLogoutUsers());
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f7f9] text-slate-900 md:flex">
      <aside className="flex w-full flex-col bg-[#17251d] px-4 py-5 text-white md:fixed md:inset-y-0 md:w-64 md:px-5">
        <NavLink to="/admin/analytics" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-[#17251d]"><ChefHat size={22} /></span>
          <span><span className="block text-sm font-bold tracking-wide">RESTAURANT</span><span className="text-xs text-emerald-200">Admin workspace</span></span>
        </NavLink>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-emerald-400 text-[#17251d]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
            <Icon size={18} />{label}{label === "Manage orders" && pending > 0 && <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs">{pending}</span>}
          </NavLink>)}
        </nav>
        <div className="mt-auto hidden border-t border-white/10 pt-4 md:block">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Account</p>
          <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10"}`}><Settings size={18} />Settings</NavLink>
          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-bold">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user?.name || "Administrator"}</p><p className="text-xs text-slate-400">Admin</p></div>
            <button onClick={logout} aria-label="Log out" title="Log out" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><LogOut size={17} /></button>
          </div>
        </div>
        <div className="mt-2 flex gap-2 md:hidden"><NavLink to="/admin/settings" className="rounded-lg px-3 py-2 text-xs text-slate-300"><Settings size={15} className="mr-1 inline" />Settings</NavLink><button onClick={logout} className="rounded-lg px-3 py-2 text-xs text-slate-300"><LogOut size={15} className="mr-1 inline" />Logout</button></div>
      </aside>
      <main className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden p-4 sm:p-6 md:ml-64 md:p-9"><Outlet /></main>
    </div>
  );
}
