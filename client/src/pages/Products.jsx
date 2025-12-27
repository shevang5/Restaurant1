import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { loadCart } from "../store/reducers/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/config";
import { Search, ShoppingCart, Filter, Heart, ChefHat } from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  // Derive categories from products
  const categories = useMemo(() => {
    const allCats = products.map((p) => p.category);
    return ["All", ...new Set(allCats)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const useAddToCart = (product) => {
    const handleAddToCart = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (!token) {
          alert("❌ Please login first");
          return;
        }

        const res = await axios.post(
          "/cart",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(loadCart(res.data));
        alert("✅ Added to Cart");
      } catch (err) {
        console.log("Error adding to cart:", err.response?.data || err.message);
        alert("❌ Failed to add to cart");
      }
    };
    return handleAddToCart;
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {/* <div className="bg-[#fff8f3] px-6 py-12 md:py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#4b2e05] mb-4 tracking-tight">
            Our <span className="text-pink-600">Delicious</span> Collection
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Explore our handcrafted pastries, cakes, and sweet treats. Baked fresh daily with love and the finest ingredients.
          </p>
        </div>
      </div> */}

      {/* Controls Section */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl z-40 mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for something sweet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto md:pb-3 md:px-5 px-2 py-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 z-50 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${selectedCategory === cat
                  ? "bg-red-600 z-50 text-white border-red-600 shadow-lg shadow-pink-200 scale-105"
                  : "bg-white z-50 text-gray-600 border-gray-200 hover:border-pink-300 hover:text-red-600 hover:bg-pink-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl z-50 mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse -z-10 flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-3">
                <div className="bg-gray-200 h-48 rounded-xl mb-4 w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-full mt-auto w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No items found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All") }}
              className="mt-6 text-red-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!token) {
        // alert("❌ Please login first");
        navigate("/register");
        return;
      }
      const res = await axios.post("/cart", { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } });
      dispatch(loadCart(res.data));
      alert("✅ Added to Cart");
    } catch (err) {
      console.log("Error adding to cart:", err.response?.data || err.message);
      alert("❌ Failed to add to cart");
    }
  }

  return (
    <div className="group h-full bg-white rounded-2xl border border-gray-100 hover:border-pink-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 md:h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[9px] font-bold px-3 py-1 rounded-full text-red-600 shadow-sm uppercase tracking-wider">
          {product.category}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          <button
            onClick={addToCart}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default Products;
