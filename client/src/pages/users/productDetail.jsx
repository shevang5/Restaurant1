import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  asyncRemoveProduct,
  asyncUpdateProduct,
} from "../../store/action/productActions";
import { loadCart } from "../../store/reducers/cartSlice";
import axios from "../../api/config";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Tag,
  DollarSign,
  FileText,
  Image as ImageIcon
} from "lucide-react";

const ProductDetail = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const products = useSelector((state) => state.productsReducers.products) || [];
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;

  const product = products.find(
    (p) => String(p.id) === String(id) || String(p._id) === String(id)
  );

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  // Remove product
  const handleRemoveProduct = () => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      dispatch(asyncRemoveProduct(product._id));
      navigate(-1);
    }
  };

  // Update product
  const handleEditProduct = async (data) => {
    if (!product) return;

    const formData = new FormData();
    formData.append("name", data.name || product.name);
    formData.append("price", data.price || product.price);
    formData.append("description", data.description || product.description);
    formData.append("category", data.category || product.category);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      await dispatch(asyncUpdateProduct(product._id, formData));
      alert("✅ Product updated successfully!");
      setShowEditForm(false);
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update product");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        alert("❌ Please login first");
        return;
      }

      const { data } = await axios.post(
        "/cart",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(loadCart(data));
      alert("✅ Added to Cart");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to products</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left - Product Image */}
            <div className="bg-[#fff8f3] relative p-8 md:p-12 flex items-center justify-center min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right - Product Details or Edit Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {showEditForm ? (
                // EDIT MODE
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Edit className="w-6 h-6 text-red-600" /> Edit Product
                    </h2>
                    <button
                      onClick={() => setShowEditForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(handleEditProduct)} className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            defaultValue={product.name}
                            {...register("name", { required: "Name is required" })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              step="any"
                              defaultValue={product.price}
                              {...register("price", { required: "Price is required" })}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <div className="relative">
                            <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              defaultValue={product.category}
                              {...register("category", { required: "Category is required" })}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          defaultValue={product.description}
                          {...register("description", { required: "Description is required" })}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Update Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-red-300 transition-colors">
                          <input
                            type="file"
                            id="image-upload"
                            {...register("image")}
                            className="hidden"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                            <span className="text-sm text-gray-500">Click to upload new image</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveProduct}
                        className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Product
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // VIEW MODE
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
                        onClick={() => setShowEditForm(true)}
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

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-400 font-medium">USD</span>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button className="flex-none p-4 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Additional Info / Trust Badges */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Free Shipping</p>
                        <p className="text-xs text-gray-500">On orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Fresh Daily</p>
                        <p className="text-xs text-gray-500">Baked every morning</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
