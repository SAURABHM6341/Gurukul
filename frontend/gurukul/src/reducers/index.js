import {combineReducers} from "@reduxjs/toolkit"
import authReducer from '../context/slices/authslice'
import profileReducer from '../context/slices/profileSlice'
import cartReducer from '../context/slices/cartslice'

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer
});

export default rootReducer;