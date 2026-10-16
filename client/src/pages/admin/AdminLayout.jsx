import { createElement, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Activity, ChefHat, ClipboardList, FileText, LogOut, Settings, Users } from "lucide-react";
import { asyncGetAllOrders } from "../../store/action/orderActions";
import { asyncLogoutUsers } from "../../store/action/userActions";

const links = [
  { to: "/admin/orders", label: "Manage orders", icon: ClipboardList },
  { to: "/admin/menu", label: "Edit menu", icon: ChefHat },
  { to: "/admin/analytics", label: "Analytics", icon: Activity },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reports", label: "Monthly report", icon: FileText },
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
      <aside className="flex w-full flex-col bg-white px-4 py-5 text-slate-800 shadow-sm md:fixed md:inset-y-0 md:w-64 md:px-5 xl:w-20 xl:px-3 2xl:w-64 2xl:px-5">
        <NavLink to="/admin/analytics" title="Restaurant admin" className="mb-8 flex items-center gap-3 px-2 xl:justify-center xl:px-0 2xl:justify-start 2xl:px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-white"><ChefHat size={22} /></span>
          <span className="xl:hidden 2xl:block"><span className="block text-sm font-bold tracking-wide text-slate-900">RESTAURANT</span><span className="text-xs text-orange-600">Admin workspace</span></span>
        </NavLink>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400 xl:hidden 2xl:block">Workspace</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(({ to, label, icon: IconComponent }) => <NavLink key={to} to={to} title={label} className={({ isActive }) => `relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition xl:justify-center xl:px-0 2xl:justify-start 2xl:px-3 ${isActive ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"}`}>
            {createElement(IconComponent, { size: 18 })}<span className="xl:hidden 2xl:inline">{label}</span>{label === "Manage orders" && pending > 0 && <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 xl:absolute xl:-right-1 xl:-top-1 xl:ml-0 xl:px-1.5 2xl:static 2xl:ml-auto 2xl:px-2">{pending}</span>}
          </NavLink>)}
        </nav>
        <div className="mt-auto hidden border-t border-slate-200 pt-4 md:block">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400 xl:hidden 2xl:block">Account</p>
          <NavLink to="/admin/settings" title="Settings" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm xl:justify-center xl:px-0 2xl:justify-start 2xl:px-3 ${isActive ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"}`}><Settings size={18} /><span className="xl:hidden 2xl:inline">Settings</span></NavLink>
          <div className="mt-4 flex items-center gap-3 px-3 py-2 xl:flex-col xl:px-0 2xl:flex-row 2xl:px-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div className="min-w-0 flex-1 xl:hidden 2xl:block"><p className="truncate text-sm font-medium text-slate-800">{user?.name || "Administrator"}</p><p className="text-xs text-slate-500">Admin</p></div>
            <button onClick={logout} aria-label="Log out" title="Log out" className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-700"><LogOut size={17} /></button>
          </div>
        </div>
        <div className="mt-2 flex gap-2 md:hidden"><NavLink to="/admin/settings" className="rounded-lg px-3 py-2 text-xs text-slate-600"><Settings size={15} className="mr-1 inline" />Settings</NavLink><button onClick={logout} className="rounded-lg px-3 py-2 text-xs text-slate-600"><LogOut size={15} className="mr-1 inline" />Logout</button></div>
      </aside>
      <main className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden p-4 sm:p-6 md:ml-64 md:p-9 xl:ml-20 2xl:ml-64"><Outlet /></main>
    </div>
  );
}
