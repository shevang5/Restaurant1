
import axios from 'axios';
import React, { useEffect, Suspense, lazy } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Loader from './components/Loader'
import { asyncCurrentUsers, asyncLogoutUsers } from './store/action/userActions';
import { asyncLoadProducts } from './store/action/productActions';
import { asyncCreateOrder } from './store/action/orderActions';
import useSocket from './hooks/useSocket';

// Lazy load layout and routes
const Navbar = lazy(() => import('./components/Navbar'))
const Mainroutes = lazy(() => import('./routes/Mainroutes'))

const App = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.usersReducer)
  const { products } = useSelector((state) => state.productsReducers)
  const { orders } = useSelector((state) => state.orders)
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  // establish socket connection for real-time updates
  useSocket();

  useEffect(() => {
    dispatch(asyncLoadProducts())
  }, [dispatch])

  useEffect(() => {
    dispatch(asyncCurrentUsers())
  }, [dispatch])

  return (
    <div className={isAdminPath ? "min-h-screen" : "lg:pb-0 pb-20"}>
      <Suspense fallback={<Loader />}>
        {!isAdminPath && <Navbar />}
        <Mainroutes />
      </Suspense>
    </div>
  )
}

export default App
