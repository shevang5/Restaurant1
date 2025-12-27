// src/redux/actions/orderActions.js
import API from "../../api/config";
import { startLoading, setOrders, addOrder, updateOrder, setError } from "../reducers/orderSlice";

// 🧾 Create new order (user)
export const asyncCreateOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const { data } = await API.post("/orders/my", orderData);
    dispatch(addOrder(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Order creation failed"));
  }
};

// 📦 Get current user's orders
export const asyncGetUserOrders = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    const { data } = await API.get("/orders/my");
    dispatch(setOrders(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch orders"));
  }
};

// 👑 Admin: Get all orders
export const asyncGetAllOrders = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    const { data } = await API.get("/orders");
    dispatch(setOrders(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch all orders"));
  }
};

// 🔄 Admin: Update order status
export const asyncUpdateOrderStatus = (id, status) => async (dispatch) => {
  try {
    const { data } = await API.put(`/orders/${id}/status`, { status });
    dispatch(updateOrder(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to update order"));
  }
};

// User cancels their own order
export const asyncCancelOrder = (id) => async (dispatch) => {
  try {
    const { data } = await API.put(`/orders/${id}/cancel`);
    dispatch(updateOrder(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to cancel order"));
  }
};
