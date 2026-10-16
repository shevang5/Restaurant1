import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from '../components/Loader'

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home'))
const Products = lazy(() => import('../pages/Products'))
const Login = lazy(() => import('../pages/auth/loginPage'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'))
const Register = lazy(() => import("../pages/Register"))
const AuthSuccess = lazy(() => import('../pages/auth/AuthSuccess'))
const ProductDetails = lazy(() => import('../pages/users/productDetail'))
const CreateProduct = lazy(() => import('../pages/admin/CreateProduct'))
const OrdersPage = lazy(() => import('../pages/OrdersPage'))
const UpdateProduct = lazy(() => import('../pages/admin/updateProduct'))
const Cart = lazy(() => import('../pages/Cart'))
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'))
const CreateManualOrder = lazy(() => import('../pages/admin/CreateManualOrder'))
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'))
const AdminMenu = lazy(() => import('../pages/admin/AdminMenu'))
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'))
const AdminCustomers = lazy(() => import('../pages/admin/AdminCustomers'))
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'))
const AdminMonthlyReport = lazy(() => import('../pages/admin/AdminMonthlyReport'))
const SavedPage = lazy(() => import('../pages/SavedPage'))

const Mainroutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myorders" element={<OrdersPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminAnalytics />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="create-order" element={<CreateManualOrder />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="update-product/:id" element={<UpdateProduct />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reports" element={<AdminMonthlyReport />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default Mainroutes

