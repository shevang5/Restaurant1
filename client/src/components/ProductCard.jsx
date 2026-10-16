import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Utensils } from "lucide-react";
import axios from "../api/config";
import { loadCart } from "../store/reducers/cartSlice";
import { getSavedProducts, SAVED_PRODUCTS_EVENT, toggleSavedProduct } from "../utils/savedProducts";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product._id || product.id;
  const [showPortionPicker, setShowPortionPicker] = useState(false);
  const [isSaved, setIsSaved] = useState(() => getSavedProducts().some((item) => String(item._id || item.id) === String(productId)));

  useEffect(() => {
    const syncSavedState = () => setIsSaved(getSavedProducts().some((item) => String(item._id || item.id) === String(productId)));
    window.addEventListener(SAVED_PRODUCTS_EVENT, syncSavedState);
    window.addEventListener("storage", syncSavedState);
    return () => {
      window.removeEventListener(SAVED_PRODUCTS_EVENT, syncSavedState);
      window.removeEventListener("storage", syncSavedState);
    };
  }, [productId]);

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSaved(toggleSavedProduct(product));
  };

  const addToCart = async (event, portion = "full") => {
    event.preventDefault();
    event.stopPropagation();
    let storedUser;
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      storedUser = {};
    }
    if (!storedUser?.token) {
      navigate("/login");
      return;
    }

    const price = portion === "half" && product.hasPortionOptions
      ? product.halfPlatePrice || product.price
      : product.price;
    try {
      const response = await axios.post("/cart", { productId, portion, price }, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });
      dispatch(loadCart(response.data));
      setShowPortionPicker(false);
      alert(`Added to Cart (${portion === "half" ? "Half" : "Full"} Plate)`);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert("Failed to add to cart");
    }
  };

  const handleAddClick = (event) => {
    if (product.hasPortionOptions) {
      event.preventDefault();
      event.stopPropagation();
      setShowPortionPicker((current) => !current);
    } else {
      addToCart(event, "full");
    }
  };

  const closePortionPicker = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPortionPicker(false);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
      <div className="relative flex-shrink-0 overflow-hidden">
        <Link to={`/products/${productId}`} className="relative block overflow-hidden">
          <img src={product.image} alt={product.name} className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-56" />
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600 shadow-sm backdrop-blur-sm">{product.category || "Menu item"}</span>
        </Link>
        <button type="button" onClick={handleSave} aria-label={isSaved ? `Remove ${product.name} from saved dishes` : `Save ${product.name}`} aria-pressed={isSaved} className={`absolute bottom-3 left-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/80 shadow-md backdrop-blur-sm transition active:scale-90 ${isSaved ? "bg-white text-orange-600" : "bg-white/95 text-slate-600 hover:text-orange-600"}`}>
          <Heart size={17} fill={isSaved ? "currentColor" : "none"}/>
        </button>
      </div>

      <div className="flex flex-grow flex-col p-2.5 md:p-4">
        <div className="mb-2 min-w-0">
          <Link to={`/products/${productId}`}><h3 className="mb-0 truncate text-base font-bold text-gray-900 transition-colors group-hover:text-red-600 md:mb-1 md:text-lg">{product.name}</h3></Link>
          <p className="line-clamp-1 text-xs leading-relaxed text-gray-500 md:text-sm">{product.description}</p>
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-2.5 md:gap-5 md:pt-3">
          <span className="shrink-0 whitespace-nowrap text-[15px] font-extrabold tracking-tight text-slate-900 md:text-lg">{product.hasPortionOptions ? `From ₹${Number(product.halfPlatePrice || product.price).toFixed(0)}` : `₹${Number(product.price).toFixed(0)}`}</span>
          <button type="button" onClick={handleAddClick} className="inline-flex min-w-0 flex-2 items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-1.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[.97] md:max-w-[150px] md:px-2 md:py-2.5 md:text-sm">
            <ShoppingCart size={14}/> Add
          </button>

          {showPortionPicker && product.hasPortionOptions && <div className="absolute bottom-12 right-0 z-20 min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl md:bottom-14">
            <div className="flex items-center justify-between border-b border-gray-200 bg-orange-50 px-3 py-2"><button type="button" onClick={closePortionPicker} className="flex items-center gap-1 text-xs text-gray-600 hover:text-orange-600"><ArrowLeft size={13}/> Back</button><span className="text-xs font-semibold text-gray-700">Choose size</span></div>
            <div className="flex flex-col gap-2 p-2">
              <button type="button" onClick={(event) => addToCart(event, "half")} className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-semibold text-orange-700 hover:bg-orange-100"><Utensils size={15}/><span className="flex-1 text-left">Half plate</span><span>₹{Number(product.halfPlatePrice || product.price).toFixed(0)}</span></button>
              <button type="button" onClick={(event) => addToCart(event, "full")} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"><Utensils size={15}/><span className="flex-1 text-left">Full plate</span><span>₹{Number(product.price).toFixed(0)}</span></button>
            </div>
          </div>}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
