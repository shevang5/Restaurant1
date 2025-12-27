import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/userSlice'
import productSlice from './reducers/productSlice'
import cartSlice from './reducers/cartSlice'
import orderReducer from './reducers/orderSlice'


export default configureStore({
  reducer: {
    usersReducer: userSlice,
    productsReducers: productSlice,
    cartsReducers: cartSlice,
    orders: orderReducer
  }
})