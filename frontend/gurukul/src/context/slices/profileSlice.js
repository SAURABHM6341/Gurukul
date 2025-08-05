// if user is student then only show cart 

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
}
const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    }
});

export const { setUser,clearUser } = profileSlice.actions;
export default profileSlice.reducer;