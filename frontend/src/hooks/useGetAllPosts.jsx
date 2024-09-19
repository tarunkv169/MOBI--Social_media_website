import { setPostUser } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
        try {
          const res = await axios.get("http://localhost:8000/api/v1/post/all", { withCredentials: true });
      
          if (res.data.success) {
            const postsWithComments = await Promise.all(
              res.data.posts.map(async (post) => {
                try {
                  console.log("Fetching comments for post ID:", post._id);
      
                  // Fetch each post's comments and populate commentedBy
                  const populatedPost = await axios.get(`http://localhost:8000/api/v1/post/${post._id}`, { withCredentials: true });
                  return populatedPost.data.post;
                } catch (error) {
                  console.error(`Error fetching post ${post._id}:`, error);
                  return post; // Return the original post if there’s an error
                }
              })
            );
      
            dispatch(setPostUser(postsWithComments)); // Store posts with populated comments in the Redux store
          }
        } catch (error) {
          console.log("Error fetching all posts:", error); // Log the error
        }
      };
      

    fetchAllPosts();
  }, [dispatch]);
};

export default useGetAllPosts;
