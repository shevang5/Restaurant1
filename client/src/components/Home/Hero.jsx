import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bell, ChevronRight, Clock3, Heart, MapPin, Menu, Search, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { asyncLogoutUsers } from "../../store/action/userActions";

const Hero = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const loadedProducts = useSelector((state) => state.productsReducers.products);
  const products = useMemo(() => Array.isArray(loadedProducts) ? loadedProducts : [], [loadedProducts]);
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;

  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
  const featuredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesQuery = product.name?.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }).slice(0, 8), [products, query, selectedCategory]);

  const logout = () => {
    dispatch(asyncLogoutUsers());
    setDrawerOpen(false);
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#fff8f4] pb-6">
      <style>{`@keyframes slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
      <section className="relative isolate min-h-[370px] overflow-hidden rounded-b-[30px] bg-[#201713] text-white sm:min-h-[430px] sm:rounded-b-[40px]">
        <img src="/images/bgImg.jpg" alt="Fresh sandwich with crisp vegetables" className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_56%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/30 to-[#1d100b]/90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/30 via-transparent to-black/10" />

        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-xl transition hover:bg-white/25">
            <Menu size={20}/>
          </button>
          <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/70">Fresh from our kitchen</p><div className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold"><MapPin size={13} className="text-orange-400"/> Pickup & home delivery</div></div>
          <Link to={user ? "/myorders" : "/login"} aria-label="View order updates" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-xl transition hover:bg-white/25"><Bell size={18}/></Link>
        </header>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10 sm:pt-12">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-lg"><Sparkles size={12}/> Made fresh, served happy</div>
            <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.04em] drop-shadow-md sm:text-5xl">A little joy<br/>in every bite.</h1>
            <p className="mt-3 max-w-[270px] text-sm leading-5 text-white/85">Find your next favorite and order it fresh from our kitchen.</p>
          </div>
        </div>

      </section>

      <form onSubmit={(event) => { event.preventDefault(); document.getElementById("home-discover")?.scrollIntoView({ behavior: "smooth" }); }} className="relative z-10 mx-auto -mt-7 flex w-[calc(100%-36px)] max-w-2xl items-center gap-2 rounded-full border border-white/80 bg-white p-2 pl-4 shadow-[0_12px_35px_rgba(23,18,15,.2)]">
        <Search size={18} className="shrink-0 text-slate-500"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes and flavors" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"/><button aria-label="Find dishes" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"><ArrowRight size={18}/></button>
      </form>

      <section id="home-discover" className="mx-auto max-w-6xl px-4 pt-6 sm:px-8 sm:pt-12">
        <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-orange-600">Explore</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">What are you craving?</h2></div><Link to="/products" className="flex items-center gap-1 text-xs font-bold text-orange-600">Full menu <ChevronRight size={15}/></Link></div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((category, index) => <button key={category} onClick={() => { setSelectedCategory(category); document.getElementById("popular-dishes")?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold shadow-sm transition ${selectedCategory === category ? "border-orange-500 bg-orange-500 text-white" : "border-orange-100 bg-white text-slate-700 hover:border-orange-300"}`}>
            <span className="text-base" aria-hidden="true">{["🍽️", "🥗", "🍔", "🍕", "🍰", "🍜"][index % 6]}</span>{category}
          </button>)}
        </div>
      </section>

      <section id="popular-dishes" className="mx-auto max-w-6xl px-4 pb-6 pt-7 sm:px-8 sm:pt-9">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-orange-600">Fresh picks</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Popular dishes</h2></div><Link to="/products" className="grid h-9 w-9 place-items-center rounded-full border border-orange-100 bg-white text-orange-600 shadow-sm" aria-label="Browse all dishes"><ArrowRight size={17}/></Link></div>
        {featuredProducts.length ? <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => <Link key={product._id || product.id} to={`/products/${product._id || product.id}`} className="group w-[72vw] max-w-[270px] shrink-0 snap-start overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-auto sm:max-w-none">
            <div className="relative h-36 overflow-hidden bg-orange-50 sm:h-40"><img src={product.image || "/images/bgImg.jpg"} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/><span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold capitalize text-orange-700 shadow-sm">{product.category || "Fresh favorite"}</span></div>
            <div className="flex items-center justify-between gap-3 p-3.5"><div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-900">{product.name}</h3><p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><Clock3 size={12}/> Made fresh to order</p></div><span className="shrink-0 text-sm font-extrabold text-orange-700">₹{Number(product.price || 0).toFixed(0)}</span></div>
          </Link>)}
        </div> : <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-10 text-center"><ShoppingBag className="mx-auto text-orange-300"/><p className="mt-3 font-semibold text-slate-800">{query ? "No dishes match your search" : "Fresh dishes are coming up"}</p><p className="mt-1 text-sm text-slate-500">Browse the full menu to discover something tasty.</p><Link to="/products" className="mt-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white">Browse menu</Link></div>}
      </section>

      {drawerOpen && <div className="fixed inset-0 z-[80] bg-slate-950/45 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}>
        <aside role="dialog" aria-modal="true" aria-label="Navigation drawer" className="flex h-full w-[min(84vw,340px)] flex-col bg-white shadow-2xl animate-[slide-in-left_.25s_ease-out]">
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 px-5 pb-6 pt-5 text-white"><div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10"/><div className="relative flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[.18em]">RESTAURANT</span><button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="rounded-full bg-white/15 p-2 hover:bg-white/25"><X size={17}/></button></div><div className="relative mt-8 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-white/20"><UserRound size={23}/></div><div className="min-w-0"><p className="truncate font-bold">{user?.name || "Welcome, food lover"}</p><p className="truncate text-xs text-orange-50">{user?.email || "Sign in to manage your profile"}</p></div></div></div>
          <nav className="flex-1 space-y-1 p-3"><Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"><Menu size={17} className="text-orange-600"/> Home</Link><Link to="/products" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"><ShoppingBag size={17} className="text-orange-600"/> Browse menu</Link>{user && <Link to="/myorders" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"><Heart size={17} className="text-orange-600"/> My orders</Link>}</nav>
          {user ? <div className="border-t border-orange-100 p-4"><div className="mb-3 rounded-2xl bg-orange-50 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Your profile</p><p className="mt-1 truncate text-sm font-semibold text-slate-800">{user.name || "Customer"}</p></div><button onClick={logout} className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700">Log out</button></div> : <div className="border-t border-orange-100 p-4"><Link to="/login" onClick={() => setDrawerOpen(false)} className="block rounded-xl bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white">Sign in / Create account</Link></div>}
        </aside>
      </div>}
    </main>
  );
};

export default Hero;
