import { createElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipboardList, Heart, Home, ShoppingCart, Utensils } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/products", label: "Menu", icon: Utensils },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingCart, requiresUser: true },
  { to: "/myorders", label: "Orders", icon: ClipboardList, requiresUser: true },
];

export default function Navbar() {
  const navigate = useNavigate();
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;
  const cart = useSelector((state) => state.cartsReducers.carts);
  const cartCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  const handleProtectedTab = (event, requiresUser) => {
    if (requiresUser && !user) {
      event.preventDefault();
      navigate("/login");
    }
  };

  return <>
    <header className="hidden border-b border-orange-100 bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3">
        <NavLink to="/" className="text-lg font-black tracking-wide text-orange-600">RESTAURANT</NavLink>
        <nav className="flex items-center gap-7 text-sm font-semibold text-slate-600">{links.map(({ to, label, end, requiresUser }) => <NavLink key={to} to={to} end={end} onClick={(event) => handleProtectedTab(event, requiresUser)} className={({ isActive }) => isActive ? "text-orange-600" : "transition hover:text-orange-600"}>{label}</NavLink>)}</nav>
      </div>
    </header>
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-orange-100 bg-white/95 px-1 pt-2 shadow-[0_-8px_30px_rgba(47,30,20,.08)] backdrop-blur-xl pb-[max(.5rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {links.map(({ to, label, icon: IconComponent, end, requiresUser }) => <NavLink key={to} to={to} end={end} onClick={(event) => handleProtectedTab(event, requiresUser)} className={({ isActive }) => `group relative flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold transition ${isActive ? "text-orange-600" : "text-slate-400 hover:text-orange-500"}`}>
          {({ isActive }) => <><span className={`grid h-8 w-10 place-items-center rounded-full transition ${isActive ? "bg-orange-100" : "bg-transparent"}`}>{createElement(IconComponent, { size: 19, strokeWidth: isActive ? 2.4 : 1.9 })}{label === "Cart" && cartCount > 0 && <span className="absolute right-2 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-orange-600 px-1 text-[9px] font-bold text-white">{cartCount}</span>}</span><span>{label}</span></>}
        </NavLink>)}
      </div>
    </nav>
  </>;
}
