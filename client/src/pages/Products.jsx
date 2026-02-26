import React, { useEffect, useState, useMemo } from "react";
import axios from "../api/config";
import { Search, ChefHat } from "lucide-react";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFoodType, setSelectedFoodType] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.userMessage ||
          "Unable to load products right now. The server may be waking up, please retry."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const allCats = products.map((p) => p.category);
    return ["All", ...new Set(allCats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesFoodType =
        selectedFoodType === "All" || product.foodType === selectedFoodType;
      return matchesSearch && matchesCategory && matchesFoodType;
    });
  }, [products, searchTerm, selectedCategory, selectedFoodType]);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl z-40 mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
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

            <div className="flex">
          


          <div className="hidden md:flex gap-2 overflow-x-auto w-full md:w-auto md:pb-3 md:px-5 px-2 py-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 z-50 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                selectedCategory === cat
                ? "bg-red-600 z-50 text-white border-red-600 shadow-lg  scale-105"
                : "bg-white z-50 text-gray-600 border-gray-200 hover:border-pink-300 hover:text-red-600 hover:bg-pink-50"
              }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex  gap-2 w-full md:w-auto px-2">
            <button
              onClick={() => setSelectedFoodType("All")}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${
                selectedFoodType === "All"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFoodType("veg")}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${
                selectedFoodType === "veg"
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setSelectedFoodType("nonveg")}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${
                selectedFoodType === "nonveg"
                ? "bg-red-600 text-white border-red-600 shadow-md"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              }`}
              >
              Nonveg
            </button>
          </div>
          <div className="md:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
              </div>


        </div>
      </div>

      <div className="max-w-7xl z-50 mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse -z-10 flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-3">
                <div className="bg-gray-200 h-48 rounded-xl mb-4 w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-full mt-auto w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="w-10 h-10 text-red-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Products not available yet</h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-6 bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
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
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedFoodType("All");
              }}
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



export default Products;
