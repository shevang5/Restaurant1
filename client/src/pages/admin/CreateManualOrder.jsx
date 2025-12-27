import React, { useState, useEffect } from "react";
import axios from "../../api/config";
import { useNavigate } from "react-router-dom";
import {
    Search,
    ShoppingBag,
    User,
    MapPin,
    Phone,
    Clock,
    Plus,
    Minus,
    Trash2,
    ChefHat,
    ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateManualOrder() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [customerDetails, setCustomerDetails] = useState({
        name: "",
        phone: "",
    });
    const [deliveryType, setDeliveryType] = useState("pickup");
    const [address, setAddress] = useState({
        line1: "",
        city: "",
        state: "",
        postalCode: "",
        phone: "",
    });
    const [pickup, setPickup] = useState({
        phone: "",
        pickTime: "",
    });

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("/products");
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Search Logic
    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Cart Functions
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        toast.success(`Added ${product.name} to cart`);
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.product._id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.product._id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Submit Order
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cart.length) return alert("Cart is empty!");
        if (!customerDetails.name || !customerDetails.phone)
            return alert("Customer Name and Phone are required!");

        setSubmitting(true);

        const orderPayload = {
            products: cart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            total: cartTotal,
            deliveryType,
            customerDetails,
        };

        if (deliveryType === "home") {
            orderPayload.address = { ...address, phone: customerDetails.phone };
        } else {
            orderPayload.pickup = {
                phone: customerDetails.phone,
                pickTime: pickup.pickTime,
            };
        }

        try {
            toast.success(`Order Created Successfully!`);
            await axios.post("/orders", orderPayload);
            // alert("Order Created Successfully!");

            navigate("/admin/orders");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create order");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link to="/admin/orders" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm mb-2 font-medium">
                            <ArrowLeft className="w-4 h-4" /> Back to Orders
                        </Link>
                        {/* <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="w-7 h-7 text-red-600" />
                            Create New Order
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Select products and enter customer details</p> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Product Selection (Takes up 2/3 on large screens) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Search Bar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products by name..."
                                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Products Grid */}
                        <div className="grid bg-white  grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                                >
                                    <div className="h-40 overflow-hidden relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                            <span className="text-white font-medium text-sm">Add to order</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 line-clamp-1" title={product.name}>{product.name}</h3>
                                            <span className="text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-lg">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="mt-auto w-full py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    <ChefHat className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                    <p>No products found matching "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Form & Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col">

                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-500" />
                                    Order Details
                                </h2>
                            </div>

                            <div className="flex-1 p-6 space-y-6">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                placeholder="e.g. John Doe"
                                                value={customerDetails.name}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                placeholder="e.g. (555) 000-0000"
                                                value={customerDetails.phone}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Delivery Method */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Method</h3>

                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setDeliveryType("pickup")}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${deliveryType === 'pickup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Pickup
                                        </button>
                                        <button
                                            onClick={() => setDeliveryType("home")}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${deliveryType === 'home' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Delivery
                                        </button>
                                    </div>

                                    {deliveryType === "pickup" ? (
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Pickup Time</label>
                                            <div className="relative">
                                                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="datetime-local"
                                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                                                    value={pickup.pickTime}
                                                    onChange={(e) => setPickup({ ...pickup, pickTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Address Line 1"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                value={address.line1}
                                                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Zip Code"
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                    value={address.postalCode}
                                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Cart Items */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cart Items</h3>
                                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{cart.reduce((a, c) => a + c.quantity, 0)} items</span>
                                    </div>

                                    {cart.length === 0 ? (
                                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-400">Cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 pr-1">
                                            {cart.map((item) => (
                                                <div key={item.product._id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm group">
                                                    <img src={item.product.image} className="w-10 h-10 rounded object-cover bg-gray-50" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                                                        <p className="text-xs text-gray-500">${item.product.price} x {item.quantity}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, -1)}
                                                            className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, 1)}
                                                            className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(item.product._id)}
                                                            className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 ml-1 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleSubmit}

                                    disabled={submitting || cart.length === 0}
                                    className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all active:scale-[0.98] ${submitting || cart.length === 0
                                        ? "bg-gray-300 cursor-not-allowed shadow-none"
                                        : "bg-red-600 hover:bg-red-700 shadow-red-200"
                                        }`}
                                >
                                    {submitting ? "Placing Order..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
            .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #e5e7eb;
            border-radius: 20px;
            }
            `}</style>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
}
