import {combineReducers} from "@reduxjs/toolkit"
import authReducer from '../context/slices/authslice'

const rootReducer = combineReducers({
    auth:authReducer
});

export default rootReducer;