import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncLogoutUsers } from "../store/action/userActions";
import { asyncGetAllOrders } from "../store/action/orderActions";
import { User, ShoppingBag, Menu, X, SquarePlus } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Redux state
  const rawUser = useSelector((state) => state.usersReducer.user);
  const user = rawUser?.user || rawUser;
  const cart = useSelector((state) => state.cartsReducers.carts);
  const cartCount =
    cart?.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0;

  const { orders } = useSelector((state) => state.orders);
  const pendingOrderCount = orders ? orders.filter(o => o.status === "pending").length : 0;

  // Admin: fetch orders on load and then listen for socket refresh events
  useEffect(() => {
    if (user?.role !== "admin") return;

    dispatch(asyncGetAllOrders()); // initial fetch

    let socket;
    const setup = async () => {
      try {
        const { io } = await import(
          "https://cdn.socket.io/4.6.1/socket.io.esm.min.js"
        );
        socket = io(process.env.VITE_API_URL || "http://localhost:5000", {
          withCredentials: true,
        });
        socket.on("order:refresh", () => {
          dispatch(asyncGetAllOrders());
        });
      } catch (err) {
        console.error("Failed to load socket for admin orders:", err);
      }
    };
    setup();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user, dispatch]);

  // Outside click for profile
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    dispatch(asyncLogoutUsers());
    navigate("/login");
  };

  return (
    <>
      <nav className="md:px-12  shadow-sm font-sans relative z-50">
        <div className="bg-white py-3 md:px-10 px-2 rounded-lg w-full flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2">
              {/* <div className="p-1 rounded-full border-2 border-orange-500">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">R</div>
              </div> */}
              <div className="flex pl-2 flex-col leading-tight">
                <span className="text-red-600 font-bold text-lg tracking-wide">RESTAURANT</span>
              </div>
            </NavLink>

            {/* Search Bar */}
            {/* <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 ml-8 w-64 lg:w-80">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500"
              />
            </div> */}
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <NavLink to="/" className={({ isActive }) =>
              isActive ? "text-red-600 font-semibold" : "hover:text-red-600 transition-colors"
            }>Home</NavLink>
            <NavLink to="/products" className={({ isActive }) =>
              isActive ? "text-red-600 font-semibold" : "hover:text-red-600 transition-colors"
            }>Menu</NavLink>
            {user && (
              <NavLink to="/myorders" className={({ isActive }) =>
                isActive ? "text-red-600 font-semibold" : "hover:text-red-600 transition-colors"
              }>My Orders</NavLink>
            )}
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin/create-product" className={({ isActive }) =>
                  isActive ? "text-red-600 font-semibold" : "hover:text-red-600 transition-colors"
                }>Create</NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) =>
                  isActive ? "text-red-600 font-semibold relative" : "hover:text-red-600 transition-colors relative"
                }>
                  Manage
                  {pendingOrderCount > 0 && (
                    <span className="absolute -top-2 -right-3 w-5 h-5 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full">
                      {pendingOrderCount}
                    </span>
                  )}
                </NavLink>
              </>
            )}
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-4">

            {/* Cart Button */}
            {user?.role === "user" && (
              <NavLink to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* Profile Button */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute z-[100] right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${profileOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-lg font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {/* <p className="text-sm text-gray-600">{user.role}</p> */}
                  </div>
                  <div className="p-2">
                    <NavLink
                      to="/myorders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-900"
                    >
                      My Orders
                    </NavLink>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="flex items-center bg-red-600  p-3 hover:bg-gray-50 rounded-lg text-white w-full"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={() => {
                  logout();
                }}
                className="bg-red-500 hidden hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Register
                </NavLink>
              </>
            )}

            {/* Mobile Menu Button */}
            {/* <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button> */}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white mt-3 rounded-lg shadow-md py-4 px-5 mx-2">
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 pb-4">
              <NavLink to="/" onClick={() => setMenuOpen(false)} className="hover:text-red-600">
                Home
              </NavLink>
              <NavLink to="/products" onClick={() => setMenuOpen(false)} className="hover:text-red-600">
                Menu
              </NavLink>
              {user?.role === "user" && (
                <NavLink to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-red-600">
                  Cart ({cartCount})
                </NavLink>
              )}
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium text-gray-700 mt-4">
              {user && (
                <NavLink to="/myorders" onClick={() => setMenuOpen(false)} className="hover:text-red-600">
                  My Orders
                </NavLink>
              )}
              {user?.role === "admin" && (
                <>
                  <NavLink to="/admin/create-product" onClick={() => setMenuOpen(false)} className="hover:text-red-600">
                    Create Product
                  </NavLink>
                  <NavLink to="/admin/orders" onClick={() => setMenuOpen(false)} className="hover:text-red-600 flex items-center justify-between">
                    Manage Orders
                    {pendingOrderCount > 0 && (
                      <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {pendingOrderCount}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation Bar - Mobile & Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md   border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around  px-2">
          <NavLink to="/" className={({ isActive }) =>
            isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs"
          }>
            <img className="h-10" src="/pngImages/landing-page.png" alt="" />
            Home
          </NavLink>

          <NavLink to="/products" className={({ isActive }) =>
            isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs"
          }>
            <img className="h-10" src="/pngImages/menu.png" alt="" />
            Menu
          </NavLink>

          {user?.role === "user" && (
            <NavLink to="/cart" className={({ isActive }) =>
              isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs relative" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs relative"
            }>
              <img className="h-10" src="/pngImages/shopping-bag.png" alt="" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              Cart
            </NavLink>
          )}

          {user && user.role !== "admin" && (
            <NavLink to="/myorders" className={({ isActive }) =>
              isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs"
            }>
              <img className="h-10" src="/pngImages/order.png" alt="" />
              Orders
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin/create-product" className={({ isActive }) =>
              isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs"
            }>
              <img className="h-10" src="/pngImages/circle.png" alt="" />
              Create
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin/orders" className={({ isActive }) =>
              isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs relative" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs relative"
            }>
              <img className="h-10" src="/pngImages/manifest.png" alt="" />
              {pendingOrderCount > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-red-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-sm ring-1 ring-white">
                  {pendingOrderCount}
                </span>
              )}
              manage <br />
              orders
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={({ isActive }) =>
                isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs"
              }>
                <User className="w-6 h-6 mb-1" />
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) =>
                isActive ? "flex flex-col items-center justify-center py-2 px-3 text-red-600 font-semibold text-xs" : "flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-red-600 text-xs"
              }>
                <SquarePlus className="w-6 h-6 mb-1" />
                Register
              </NavLink>
            </>
          ) : null}
        </div>
      </div>

      {/* Add padding to body to account for fixed bottom nav */}
      <style>{`
        @media (max-width: 1024px) {
          body {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;

