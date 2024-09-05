import {  Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart,FaHeart } from "react-icons/fa";
import Commentdialog from "./Commentdialog";
import { useState } from "react";
import PropTypes from 'prop-types'; 
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPostUser } from "@/redux/postSlice";


const Post = ({post}) => {

   const [text,settext] = useState("");

   const [open,setOpen] = useState(false);

   const user = useSelector(store=>store.auth.user);
   const all_posts = useSelector(store=>store.post.posts);     //this is all posts and above prop->post is about one post of many posts
   
   const dispatch = useDispatch();

   const [liked,setLiked] = useState(post.likes?.includes(user._id) || false)
   const [postlike,setPostLike] = useState(post.likes.length);

   const [comments,setComments] = useState(post.comments);

   const onChangeHandler=(e)=>{
      //put change value into const and check it is empty or not
      const inputtext =e.target.value;   
      if(inputtext.trim())
      {
          settext(inputtext);
      }
      else{
         settext("")
      }
   }

   const postDeleteHandler=async(e)=>{
      e.preventDefault();
      try {

            //1️⃣ task:1 =>for dbs---->permanent storage
         const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`,{withCredentials:true})  // no header as we r not hosting
         
         if(res.data.success)
         {
            //2️⃣ task:2 =>for reduxtoolkit---->to use it anywhere on UI
            const updated_for_all_posts = all_posts.filter((each_post)=>each_post?._id !== post?._id) // put each post in again all_posts expect the post whose id i compare
            dispatch(setPostUser(updated_for_all_posts));

            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
        const errorMessage = error.response?.data?.message || "An error occurred while deleting the post.";
        toast.error(errorMessage);
      }
   }

   const postLikeHandler = async (e) => {
      e.preventDefault();
  
      try {
            //1️⃣ task:1 =>for dbs---->permanent storage
                 const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/like_or_dislike`, { withCredentials: true });
  
                 if (res.data.success) {

                     //3️⃣ task:3 =>for UI  or to continue component
                          setPostLike(prevLikes => liked ? prevLikes - 1 : prevLikes + 1);
                          setLiked(!liked);
         
                     //2️⃣ task:2 =>for reduxtoolkit---->to use it anywhere on UI
                          const updated_Post_data = all_posts.map(p =>
                              p._id === post._id
                                  ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] }
                                  : p
                          );
         
                          dispatch(setPostUser(updated_Post_data));
         
                     toast.success(res.data.message);
                 }
      } catch (error) {
          console.error(error);
          const errorMessage = error.response?.data?.message || "An error occurred while liking/disliking the post.";
          toast.error(errorMessage);
      }
  };


  const commentAddHandler=async(e)=>{
   e.preventDefault();
  
   try {
         //1️⃣ task:1 =>for dbs---->permanent storage
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,{text},{
               headers:{
                  "Content-Type":"application/json"
               },
               withCredentials:true
            })

            if(res.data.success)
            {
               //2️⃣ task:2 =>for reduxtoolkit---->to use it anywhere on UI
                    const update_comment_data = [...comments,res.data.comment];
           
                    const update_post_data = all_posts.map(p=>
                       p._id === post._id 
                       ? {...p, comments : update_comment_data} 
                       : p
                    )
               
                    dispatch(setPostUser(update_post_data));
      
               //3️⃣ task:3 =>for UI  or to continue component
                    setComments(update_comment_data)
      
                    toast.success(res.data.message);
            }
   } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
   }
  }
  

   return (
      <div className="my-8 w-full max-w-sm mx-auto">


         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                  <Avatar>
                     <AvatarImage src={post.author?.profilePicture} />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
               <span>{post.author?.username}</span>
            </div>
            <Dialog>
               <DialogTrigger>
                  <MoreHorizontal className="cursor-pointer" />   {/* 3 dots icon */}
               </DialogTrigger>
               <DialogContent>
                  <div className="flex flex-col items-center text-sm text-center">
                     <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                     <Button variant="ghost" className="cursor-pointer w-fit ">Add to favourites</Button>
                     {user   &&   user._id === post.author._id    &&    <Button variant="ghost"  onClick={postDeleteHandler}    className="cursor-pointer w-fit">Delete</Button>}
                  </div>
               </DialogContent>
            </Dialog>
         </div>
          

         <img 
         className="rounded-sm w-full my-2 aspect-square object-cover"
         src={post.image} 
         alt="post" />
         

         <div className="flex items-center justify-between my-2">
            <div className="flex items-center gap-3">
               { liked ? <FaHeart onClick={postLikeHandler} size="22px" className="cursor-pointer" /> :<FaRegHeart onClick={postLikeHandler} size="22px" className="cursor-pointer hover:text-gray-600"/>}
               <MessageCircle onClick={()=>setOpen(true)} className="cursor-pointer hover:text-gray-600"/>
               <Send className="cursor-pointer hover:text-gray-600"/>
            </div>
            <Bookmark className="cursor-pointer hover:text-gray-600"/>
         </div>


         <span className="font-medium block mb-2">{postlike || 0}  likes</span>
         <p>
            <span className="font-medium mr-2">{post.author?.username}</span>
            {post.caption}
         </p>


         <span  onClick={()=>setOpen(true)}  className="cursor-pointer text-sm text-gray-400">View all {comments.length} comments</span>
         <Commentdialog open={open} setOpen={setOpen} post={post}/>



         <div className="flex items-center justify-between">
            <input 
            type="text" 
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
            value={text}
            onChange={onChangeHandler}
            />
            {
               text && <span className="cursor-pointer text-[#3BADF8]" onClick={commentAddHandler}>Post</span>  // if there is text in comment box then only show Post button
            }
         </div>
         
      </div>
   )
};

// Post.propTypes = {
//    post: PropTypes.shape({
//       author: PropTypes.shape({
//          profilePicture: PropTypes.string.isRequired,
//          username: PropTypes.string.isRequired
//       }).isRequired,
//       image: PropTypes.string.isRequired,
//       caption: PropTypes.string.isRequired
//    }).isRequired
// };

Post.propTypes = {
   
   post: PropTypes.func.isRequired,
 };
 
export default Post;
