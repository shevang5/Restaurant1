import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
    <div className="bg-gray-100 p-8 rounded-full mb-4 text-5xl">🛒</div>
    <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
    <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
    <Link 
      to="/products" 
      className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
    >
      Browse Menu
    </Link>
  </div>
);

export default EmptyCart;
