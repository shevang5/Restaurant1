import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
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

function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

function RequireAdmin({ children }) {
  const reduxSession = useSelector((state) => state.usersReducer.user)
  const session = reduxSession || getStoredSession()
  const user = session?.user || session

  if (!session?.token || user?.role !== 'admin') {
    return <Navigate to={session?.token ? '/' : '/login'} replace />
  }

  return children
}

function ExcludeAdmin({ children }) {
  const reduxSession = useSelector((state) => state.usersReducer.user)
  const session = reduxSession || getStoredSession()
  const user = session?.user || session

  return user?.role === 'admin' ? <Navigate to="/admin/orders" replace /> : children
}

const Mainroutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<ExcludeAdmin><Home /></ExcludeAdmin>} />
        <Route path='/products' element={<ExcludeAdmin><Products /></ExcludeAdmin>} />
        <Route path='/products/:id' element={<ExcludeAdmin><ProductDetails /></ExcludeAdmin>} />
        <Route path='/cart' element={<ExcludeAdmin><Cart /></ExcludeAdmin>} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myorders" element={<ExcludeAdmin><OrdersPage /></ExcludeAdmin>} />
        <Route path="/saved" element={<ExcludeAdmin><SavedPage /></ExcludeAdmin>} />
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminOrders />} />
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

