
import axios from 'axios';
import React, { useEffect, Suspense, lazy } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/Loader'
import { asyncCurrentUsers, asyncLogoutUsers } from './store/action/userActions';
import { asyncLoadProducts } from './store/action/productActions';
import { asyncCreateOrder } from './store/action/orderActions';

// Lazy load layout and routes
const Navbar = lazy(() => import('./components/Navbar'))
const Mainroutes = lazy(() => import('./routes/Mainroutes'))

const App = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.usersReducer)
  const { products } = useSelector((state) => state.productsReducers)
  const { orders } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(asyncLoadProducts())
  }, [dispatch])

  useEffect(() => {
    dispatch(asyncCurrentUsers())
  }, [dispatch])

  return (
    <div className="lg:pb-0 pb-20">
      <Suspense fallback={<Loader />}>
        <Navbar />
        <Mainroutes />
      </Suspense>
    </div>
  )
}

export default App
