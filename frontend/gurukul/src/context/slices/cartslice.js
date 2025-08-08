// // for add to cart

// import { createSlice } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";

// const initialState = {
// totalItem:localStorage.getItem("item")||0,
// }

// const cartSlice = createSlice({
//     name:"cart",
//     initialState:initialState,
//     reducers:{

//         //add to cart
//         //remove from cart
//         //reset cart ka reducers functions likho
//     },
// });
// export const {setCart} = cartSlice.actions;
// export default cartSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        setCart(state, value) {
            state.totalItems = value.payload;
        },
        // Add to Cart
        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id);

            // If course is already in cart, do not modify the state
            if (index !== -1) {
                toast.error("Course already in cart");
                return;
            }

            // Add the new course to the cart
            state.cart.push(course);
            // Update total items and total price
            state.totalItems++;
            state.total += course.price;

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
            toast.dismiss();
            toast.success("Course added to cart");
        },
        // Remove from Cart
        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index !== -1) {
                // Update total items and total price
                state.totalItems--;
                state.total -= state.cart[index].price;
                // Remove the course from the cart
                state.cart.splice(index, 1);

                // Update localStorage
                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
                toast.dismiss();
                toast.success("Course removed from cart");
            }
        },
        // Reset Cart
        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            // Clear from localStorage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },
    },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;