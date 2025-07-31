// for add to cart

import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
totalItem:localStorage.getItem("item")?JSON.parse(localStorage.getItem("item")):0,
}

const cartSlice = createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        setCart(state,value){
            state.totalItem = value.payload;
        },
        //add to cart
        //remove from cart
        //reset cart ka reducers functions likho
    },
});
export const {setCart} = cartSlice.actions;
export default cartSlice.reducer;