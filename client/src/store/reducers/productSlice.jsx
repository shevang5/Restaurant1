import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products:[]
}

const productSlice = createSlice({
    name:"product",
    initialState,
    reducers:{
        loadProduct:(state, action)=>{
            state.products = Array.isArray(action.payload) ? action.payload : [action.payload];
        }
    }

})

export default productSlice.reducer;
export const { loadProduct } = productSlice.actions;