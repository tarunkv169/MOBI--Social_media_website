
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import PropTypes from 'prop-types';
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const Commentdialog = ({ open, setOpen }) => {

   const [text,setText] = useState("");

   const onChangeHandler=(e)=>{
       const inputtext = e.target.value;
       if(inputtext.trim())              // as inputtext is not bool...so we apply inputtext.trim()-->not empty,,, !inputtext.trim()---->empty
       {
          setText(inputtext);
       }else{
          setText("");
       }
   }

   const sendMessageHandler=(e)=>{
     alert(e.target.value)
   }


  return (
    <div>
      <Dialog open={open} setOpen={setOpen}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="flex flex-col max-w-5xl p-0">
          <div className="flex flex-1">
               <div className="w-1/2">
                    <img
                      className="w-full h-full object-cover rounded-l-lg"
                      src="https://th.bing.com/th/id/OIP.92xngI7-q72ChW8r30bJqwHaEK?rs=1&pid=ImgDetMain"
                      alt="post_img"
                    />
              </div>
              <div className="w-1/2 flex flex-col justify-between">
                    <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                              <div>
                                 <Link>
                                   <Avatar>
                                      <AvatarImage src="https://github.com/shadcn.png" />
                                      <AvatarFallback>CN</AvatarFallback>
                                   </Avatar>
                                 </Link>
                              </div>
                                <Link><span className="font-semibold text-xs">Username</span></Link>
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

                    <div className="flex-1 max-h-96 p-4 overflow-y-auto">
                        all comments ayenge
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
