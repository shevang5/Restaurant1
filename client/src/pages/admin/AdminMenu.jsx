import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Pencil, Trash2, Utensils, Leaf } from "lucide-react";
import { toast } from "react-toastify";
import { asyncRemoveProduct } from "../../store/action/productActions";

export default function AdminMenu() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productsReducers.products) || [];

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      await dispatch(asyncRemoveProduct(product._id || product.id));
      toast.success(`${product.name} deleted successfully.`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to delete ${product.name}.`);
    }
  };

  return <div className="mx-auto max-w-6xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-medium text-emerald-700">Catalog</p><h1 className="mt-1 text-3xl font-bold">Edit menu</h1><p className="mt-2 text-sm text-slate-500">Manage your restaurant products and pricing.</p></div>
      <Link to="/admin/create-product" className="rounded-xl bg-[#1d6b45] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#175638]"><Plus size={17} className="mr-2 inline" />Add product</Link>
    </header>

    <div className="flex items-center justify-between"><h2 className="font-semibold text-slate-800">Products</h2><span className="text-sm text-slate-500">{products.length} items</span></div>
    {products.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => <article key={product._id || product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden bg-slate-100"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/><span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700 shadow-sm">{product.category || "Menu item"}</span><span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold capitalize text-emerald-700 shadow-sm"><Leaf size={12} className="mr-1 inline"/>{product.foodType || "Veg"}</span></div>
        <div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-bold text-slate-900">{product.name}</h3><p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">{product.description || "A favorite from our menu."}</p></div><p className="shrink-0 text-lg font-bold text-emerald-800">₹{Number(product.price || 0).toFixed(2)}</p></div>{product.hasPortionOptions && <p className="mt-2 text-xs text-slate-500">Half plate from ₹{Number(product.halfPlatePrice || 0).toFixed(2)}</p>}
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3"><Link to={`/admin/update-product/${product._id || product.id}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"><Pencil size={15}/>Edit product</Link><button onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`} className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"><Trash2 size={16}/></button></div>
        </div>
      </article>)}
    </div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"><Utensils className="mx-auto text-slate-300"/><p className="mt-3 font-medium text-slate-800">No menu items yet</p><p className="mt-1 text-sm text-slate-500">Add your first product to get started.</p></div>}
  </div>;
}
