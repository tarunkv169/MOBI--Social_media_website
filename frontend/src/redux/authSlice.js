import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null
    },
    reducers:{
         //actions
         setAuthUser:(state,action)=>{
            console.log("Action Payload:", action.payload); // Log the payload
            state.user=action.payload
         }
    }
})

export const {setAuthUser}=authSlice.actions;
export default authSlice.reducer;