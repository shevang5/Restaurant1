import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Utensils } from "lucide-react";
import axios from "../api/config";
import { loadCart } from "../store/reducers/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPortionPicker, setShowPortionPicker] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  const addToCart = async (e, portion = "full") => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!token) {
        navigate("/register");
        return;
      }

      const selectedPrice =
        portion === "half" && product.hasPortionOptions
          ? product.halfPlatePrice || product.price
          : product.price;

      const res = await axios.post(
        "/cart",
        {
          productId: product._id,
          portion,
          price: selectedPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(loadCart(res.data));
      setShowPortionPicker(false);
      alert(`Added to Cart (${portion === "half" ? "Half" : "Full"} Plate)`);
    } catch (err) {
      console.log("Error adding to cart:", err.response?.data || err.message);
      alert("Failed to add to cart");
    }
  };

  const handleAddClick = (e) => {
    if (product.hasPortionOptions) {
      e.preventDefault();
      e.stopPropagation();
      setShowPortionPicker((prev) => !prev);
      return;
    }

    addToCart(e, "full");
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPortionPicker(false);
  };

  return (
    <div className="group h-full bg-white rounded-2xl border border-gray-200 hover:border-pink-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 md:h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[9px] font-bold px-3 py-1 rounded-full text-red-600 shadow-sm uppercase tracking-wider">
          {product.category}
        </div>

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      <div className="p-2 md:p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-0 md:mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-1 leading-relaxed">{product.description}</p>
        </div>

        <div className="mt-auto flex flex-col items-left justify-between gap-3 pt-1 md:pt-4  relative">
          {product.hasPortionOptions ? (
            <div className="text-md flex w-full  text-gray-900 leading-tight">
              <div>Full: ₹{Number(product.price).toFixed()}</div>
              <div className="text-[#858585] px-2 flex">| Half ₹{Number(product.halfPlatePrice || product.price).toFixed()}</div>
            </div>
          ) : (
            <span className="text-xl  text-gray-900">₹{Number(product.price).toFixed()}</span>
          )}

          <button
            onClick={handleAddClick}
            className="flex w-full justify-center text-center items-center gap-2 bg-green-600 text-white px-4 py-1 md:py-2.5 rounded-full text-sm font-medium hover:bg-red-700 active:scale-95 transition-all shadow-md hover:shadow-lg"

          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>

          {showPortionPicker && product.hasPortionOptions && (
            <div className="absolute bottom-14 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20 min-w-[160px]">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 px-3 py-2 flex items-center justify-between border-b border-gray-200">
                <button
                  type="button"
                  onClick={handleBackClick}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-semibold text-gray-700">Choose Size</span>
              </div>

              <div className="p-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={(e) => addToCart(e, "half")}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all hover:shadow-md"
                >
                  <Utensils className="w-4 h-4" />
                  <span className="flex-1 text-left">Half Plate</span>
                  <span className="text-[10px] font-bold">₹{Number(product.halfPlatePrice || product.price).toFixed(2)}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => addToCart(e, "full")}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all hover:shadow-md"
                >
                  <Utensils className="w-4 h-4" />
                  <span className="flex-1 text-left">Full Plate</span>
                  <span className="text-[10px] font-bold">₹{Number(product.price).toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

