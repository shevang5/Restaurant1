import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // You forgot to import this

const initialState = {
  user: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    }
  }
});

export default userSlice.reducer;
export const { loadUser, removeUser } = userSlice.actions;


