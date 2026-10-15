import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { asyncLogoutUsers } from "../../store/action/userActions";

export default function AdminSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;
  const logout = () => { dispatch(asyncLogoutUsers()); navigate("/login"); };
  return <div className="mx-auto max-w-4xl space-y-7"><header><p className="text-sm font-medium text-emerald-700">Preferences</p><h1 className="mt-1 text-3xl font-bold">Settings</h1><p className="mt-2 text-sm text-slate-500">Your administrator account and session.</p></header>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><UserRound size={25}/></div><div><h2 className="font-semibold">Administrator profile</h2><p className="mt-1 text-sm text-slate-500">Account details for this admin session.</p></div></div><div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Name</p><p className="mt-1 font-medium">{user?.name || "Administrator"}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p><p className="mt-1 font-medium">{user?.email || "—"}</p></div></div></section>
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700"><ShieldCheck size={20}/></span><div><h2 className="font-semibold">Account session</h2><p className="mt-1 text-sm text-slate-500">Sign out of the admin panel on this device.</p></div></div><button onClick={logout} className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700"><LogOut size={16} className="mr-2 inline"/>Log out</button></section>
  </div>;
}
