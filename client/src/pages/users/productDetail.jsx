import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { loadCart } from "../../store/reducers/cartSlice";
import axios from "../../api/config";
import {
  ArrowLeft,
  ShoppingCart,
  // Heart,
  Edit,
  Package,
  Tag,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPortion, setSelectedPortion] = useState("full");

  const products =
    useSelector((state) => state.productsReducers.products) || [];
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;

  const product = products.find(
    (p) => String(p.id) === String(id) || String(p._id) === String(id),
  );

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">Product not found</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        alert("Please login first");
        return;
      }

      const cartItem = {
        productId: product._id,
        portion: product.hasPortionOptions ? selectedPortion : "full",
        price: (() => {
          if (!product.hasPortionOptions) return product.price;
          if (selectedPortion === "half") {
            return product.halfPlatePrice || product.price * 0.6;
          }
          return product.price;
        })(),
      };

      const { data } = await axios.post("/cart", cartItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(loadCart(data));
      alert(
        `Added to Cart ${
          product.hasPortionOptions
            ? `(${selectedPortion === "half" ? "Half" : "Full"} Plate)`
            : ""
        }`,
      );
    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="group mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to products</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-[#fff8f3] relative p-2 md:p-12 flex items-center justify-center ">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full max-w-sm max-h-[140px] md:max-h-[320px] object-cover drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-2 md:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                      {product.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                      {product.name}
                    </h1>
                  </div>
                  {user && user.role === "admin" && (
                    <button
                      onClick={() =>
                        navigate(`/admin/update-product/${product._id || product.id}`)
                      }
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                      title="Edit Product"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 border-t border-gray-100 space-y-2">
                  {product.hasPortionOptions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Portion Size
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPortion("half")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedPortion === "half"
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-bold text-lg">Half Plate</div>
                          <div className="text-sm mt-1">
                            ₹{product.halfPlatePrice}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPortion("full")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedPortion === "full"
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-bold text-lg">Full Plate</div>
                          <div className="text-sm mt-1">₹{product.price}</div>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">₹{product.hasPortionOptions
                        ? selectedPortion === "half"
                          ? product.halfPlatePrice
                          : product.price
                        : product.price}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      INR
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                      {product.hasPortionOptions && (
                        <span className="text-sm font-normal opacity-90">
                          ({selectedPortion === "half" ? "Half" : "Full"} Plate)
                        </span>
                      )}
                    </button>
                    {/* <button className="flex-none p-4 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                      <Heart className="w-6 h-6" />
                    </button> */}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Free Shipping
                      </p>
                      <p className="text-xs text-gray-500">
                        On orders over ₹50
                      </p>
                    </div> */}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Fresh Daily
                      </p>
                      <p className="text-xs text-gray-500">
                        Baked every morning
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


