import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState:{
        posts: []           // initiallize with empty array...as we want to store array of posts
    },
    reducers:{
        //actions
        setPostUser:(state,action)=>{
           state.posts=action.payload    // here putting in that array
        }
    }
})

export const {setPostUser} = postSlice.actions;
export default postSlice.reducer;