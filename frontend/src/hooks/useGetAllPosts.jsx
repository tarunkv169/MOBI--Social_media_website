import { setPostUser } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch} from "react-redux";


const useGetAllPosts = () => { 

   const dispatch = useDispatch();

   useEffect(()=>{
        const fetchAllPosts = async()=>{
            try {
               const res = await axios.get("http://localhost:8000/api/v1/post/all",{withCredentials:true});
   
               if(res.data.success)
               {
                   dispatch(setPostUser(res.data.posts));  // ✨here dispatch all posts and store in store 
                                                                  // ✨from <CreatePost/> we dispatch that new post and store it in store
               }                                                         // ✨total posts are useselector by <Posts/>
            } catch (error) {
               console.log(error);
            }
         }
     
         fetchAllPosts();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   } , []);

};

export default useGetAllPosts;
