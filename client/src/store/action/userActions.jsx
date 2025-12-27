import { loadUser, removeUser } from '../reducers/userSlice';
import axios from "../../api/config";

export const asyncRegisterUser = (user) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/auth/register`, user);
    localStorage.setItem("user", JSON.stringify(data));
    dispatch(loadUser(data));
    console.log("✅ User registered:", data);
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};

export const asyncLoginUsers = (user) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/auth/login`, user);
    localStorage.setItem("user", JSON.stringify(data));
    dispatch(loadUser(data));
    console.log("✅ User logged in:", data);
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};



export const asyncCurrentUsers = () => async (dispatch) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Check if it's a valid user object with both token and user data
      if (storedUser.token && storedUser.user) {
        dispatch(loadUser(storedUser));
      } else {
        console.log("Invalid user data format");
        localStorage.removeItem("user");
      }
    } else {
      console.log("No user logged in");
    }
  } catch (error) {
    console.error("Error loading current user:", error);
    // Clean up invalid data
    localStorage.removeItem("user");
  }
};



export const asyncLogoutUsers = () => async (dispatch) => {
  try {
    localStorage.removeItem("user");
    dispatch(removeUser());
    console.log("User logged out");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
