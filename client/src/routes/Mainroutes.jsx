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
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/create-order" element={<CreateManualOrder />} />

        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/admin/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </Suspense>
  )
}

export default Mainroutes

