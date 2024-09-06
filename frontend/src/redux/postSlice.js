import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState:{
        posts: [],           // initiallize with empty array...as we want to store array of posts
        selectedPost: null
    },
    reducers:{
        //actions
        setPostUser:(state,action)=>{
           state.posts=action.payload    // here putting in that array
        },

        setSelectedPost:(state,action)=>{
            state.selectedPost=action.payload
        }
    }
})

export const {setPostUser,setSelectedPost} = postSlice.actions;
export default postSlice.reducer;