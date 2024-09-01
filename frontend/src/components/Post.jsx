import {  Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import Commentdialog from "./Commentdialog";
import { useState } from "react";
import PropTypes from 'prop-types'; 


const Post = ({post}) => {

   const [text,settext] = useState("");

   const [open,setOpen] = useState(false);

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

   return (
      <div className="my-8 w-full max-w-sm mx-auto">


         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                  <Avatar>
                     <AvatarImage src={post.author.profilePicture} />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
               <span>{post.author.username}</span>
            </div>
            <Dialog>
               <DialogTrigger>
                  <MoreHorizontal className="cursor-pointer" />   {/* 3 dots icon */}
               </DialogTrigger>
               <DialogContent>
                  <div className="flex flex-col items-center text-sm text-center">
                     <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                     <Button variant="ghost" className="cursor-pointer w-fit ">Add to favourites</Button>
                     <Button variant="ghost" className="cursor-pointer w-fit ">Delete</Button>
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
               <FaRegHeart size="22px" className="cursor-pointer hover:text-gray-600"/>
               <MessageCircle onClick={()=>setOpen(true)} className="cursor-pointer hover:text-gray-600"/>
               <Send className="cursor-pointer hover:text-gray-600"/>
            </div>
            <Bookmark className="cursor-pointer hover:text-gray-600"/>
         </div>


         <span className="font-medium block mb-2">1k likes</span>
         <p>
            <span className="font-medium mr-2">{post.author.username}</span>
            {post.caption}
         </p>


         <span  onClick={()=>setOpen(true)}  className="cursor-pointer text-sm text-gray-400">View all 10 comments</span>
         <Commentdialog open={open} setOpen={setOpen}/>



         <div className="flex items-center justify-between">
            <input 
            type="text" 
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
            value={text}
            onChange={onChangeHandler}
            />
            {
               text && <span className="text-[#3BADF8]">Post</span>  // if there is text in comment box then only show Post button
            }
         </div>
         
      </div>
   )
};

Post.propTypes = {
   post: PropTypes.shape({
      author: PropTypes.shape({
         profilePicture: PropTypes.string.isRequired,
         username: PropTypes.string.isRequired
      }).isRequired,
      image: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired
   }).isRequired
};
export default Post;
