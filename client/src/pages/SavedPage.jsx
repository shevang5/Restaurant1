import { useEffect, useState } from "react";
import { Heart, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getSavedProducts, SAVED_PRODUCTS_EVENT } from "../utils/savedProducts";

export default function SavedPage() {
  const [savedProducts, setSavedProducts] = useState(getSavedProducts);

  useEffect(() => {
    const syncSavedProducts = () => setSavedProducts(getSavedProducts());
    window.addEventListener(SAVED_PRODUCTS_EVENT, syncSavedProducts);
    window.addEventListener("storage", syncSavedProducts);
    return () => {
      window.removeEventListener(SAVED_PRODUCTS_EVENT, syncSavedProducts);
      window.removeEventListener("storage", syncSavedProducts);
    };
  }, []);

  if (savedProducts.length) return <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-6 pb-10 sm:px-8">
    <header className="mb-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-orange-600">Your favorites</p><h1 className="mt-1 text-2xl font-extrabold text-slate-900">Saved dishes</h1></header>
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">{savedProducts.map((product) => <ProductCard key={product._id || product.id} product={product}/>)}</section>
  </main>;

  return <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 pb-10 text-center">
    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-orange-100 text-orange-600"><Heart size={28}/></div>
    <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Saved dishes</h1>
    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Your favorite dishes will be easy to find here. Browse the menu and pick something you love.</p>
    <Link to="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"><Utensils size={17}/> Browse menu</Link>
  </main>;
}
