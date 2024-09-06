
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import PropTypes from 'prop-types';
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { toast } from "sonner";
import axios from "axios";
import { setPostUser } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Commentdialog = ({ open, setOpen }) => {

   const [text,setText] = useState("");
   const {selectedPost,posts} = useSelector(store=>store.post);
   const [comment,setComment] = useState([]);
   const user = useSelector(store=>store.auth.user);
   const dispatch = useDispatch();


   const onChangeHandler=(e)=>{
       const inputtext = e.target.value;
       if(inputtext.trim())              // as inputtext is not bool...so we apply inputtext.trim()-->not empty,,, !inputtext.trim()---->empty
       {
          setText(inputtext);
       }else{
          setText("");
       }
   }


   useEffect(()=>{
     if(selectedPost)
     {
        setComment(selectedPost?.comments)
     }
   },[selectedPost])

   const sendMessageHandler=async(e)=>{
     e.preventDefault();
     try {
        // task:1 
        const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,{text},{
          headers:{
            'Content-Type':'application/json'
          },
          withCredentials:true
        })
        

        console.log(res.data.comment);
        if(res.data.success)
        {
          // task:2
          const update_comment_data = [...comment, res.data.comment];

          const update_post_data = posts.map(p=>
            p._id === selectedPost._id 
            ? {...p, comments : update_comment_data} 
            : p
          )
          
          dispatch(setPostUser(update_post_data));

          // task:3
          setComment(update_comment_data);

          toast.success(res.data.message);
          setText("");
        }
       
     } catch (error) {
         console.log(error);
         toast.error(error.response.data.message)
     }
   }


  return (
    <div>
      <Dialog open={open} setOpen={setOpen}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="flex flex-col max-w-5xl p-0">
          <div className="flex flex-1">
               <div className="w-1/2">
                    <img
                      className="w-full h-full object-cover rounded-l-lg"
                      src={selectedPost?.image}
                      alt="post_img"
                    />
              </div>
              <div className="w-1/2 flex flex-col justify-between">
                    <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                              <div>
                                 <Link>
                                   <Avatar>
                                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                                      <AvatarFallback>CN</AvatarFallback>
                                   </Avatar>
                                 </Link>
                              </div>
                              <div  className="flex items-center gap-2">
                                <Link><span className="font-semibold text-xs">{selectedPost?.author?.username}</span></Link>
                                { user?._id === selectedPost?.author?._id &&  <Badge>Author</Badge> }
                              </div>
                          </div>
        
                          <div>
                             <Dialog>
                                <DialogTrigger>
                                      <MoreHorizontal className="cursor-pointer"/>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center text-sm text-center">
                                   <div className="flex flex-col items-center gap-1">
                                       <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                                       <Button variant="ghost" className="cursor-pointer w-fit">Add to favourites</Button>
                                       <Button variant="ghost" className="cursor-pointer w-fit">Delete</Button>
                                   </div>
                                </DialogContent>
                             </Dialog>
                          </div>
                    </div>
                    <hr />
                    <div className="flex-1 max-h-96 p-4 overflow-y-auto">
                        {
                           comment.map((comment)=><Comment  key={comment._id} comment={comment}/>)
                        }
                    </div>

                    <div className="p-4">
                          <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="Add a comment..." 
                                className="w-full outline-none border border-gray-300 p-2 rounded"
                                value={text}
                                onChange={onChangeHandler}
                              />
                             <Button disabled={!text.trim()} onClick={sendMessageHandler}>Send</Button>
                          </div>
                          
                    </div>

              </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
};

// Adding PropTypes for validation
Commentdialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Commentdialog;
