import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, updateOrder } from "../store/reducers/orderSlice";

let socket;

export default function useSocket() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.usersReducer.user);

  useEffect(() => {
    if (!user) return;

    // dynamically load socket.io-client from CDN to avoid local install
    const loadSocket = async () => {
      const { io } = await import(
        "https://cdn.socket.io/4.6.1/socket.io.esm.min.js"
      );
      socket = io(process.env.VITE_API_URL || "http://localhost:5000", {
        withCredentials: true,
      });

      socket.emit("joinUser", user._id);

      socket.on("order:update", (order) => {
        dispatch((dispatch, getState) => {
          const { orders } = getState().orders;
          const exists = orders.find((o) => o._id === order._id);
          if (exists) {
            dispatch(updateOrder(order));
          } else {
            dispatch(addOrder(order));
          }
        });
      });
    };

    loadSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [dispatch, user]);
}
