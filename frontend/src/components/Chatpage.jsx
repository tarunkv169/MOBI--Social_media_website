import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
// import { toast } from "sonner";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const Chatpage = () => {
  
  const user = useSelector(store=>store.auth.user);
  const suggestedUsers = useSelector(store=>store.auth.suggestedUsers);
  const selectedUser = useSelector(store=>store.auth.selectedUser);
  const onlineUsers = useSelector(store=>store.chat.onlineUsers);
  const messages = useSelector(store=>store.chat.messages);

  const dispatch = useDispatch();

  const [textMessage,setTextMessage]=useState("");

  const sendMessageHandler=async(recieverId)=>{
    
    console.log('this is begin of send')
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${recieverId}`,{textMessage},{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })

      if(res.data.success)
      {
        console.log('hello')
        console.log(res.data.newMsg)
        
        dispatch(setMessages([...messages,res.data.newMsg]));
        setTextMessage("");
        console.log('bye')
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }

  }

  
   
  return (
    <div className="flex ml-[16%] h-screen ">

           <section className="w-full md:w-1/4 my-8">
                 <h1 className="font-bold text-xl mb-4 px-3">{user?.username}</h1>
                 <hr className="mb-4 border-gray-300"/>
                 <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.length === 0
                        ?
                          (
                            <span>No Friend to Chat</span>
                          ):
                          (
                            
                               suggestedUsers.map((suggUser)=>{
                                   const isOnline = onlineUsers.includes(suggUser?._id)
                                   return (
                                            <div key={suggUser._id} onClick={()=>dispatch(setSelectedUser(suggUser))} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                                                <Avatar className="w-14 h-14">
                                                    <AvatarImage src={suggUser?.profilePicture} />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{suggUser?.username}</span>
                                                    <span className={`font-bold text-xs ${isOnline?'text-green-600':'text-red-600'}`}>{isOnline? "Online":"Offline"}</span>
                                                </div>
                              
                                            </div>
                                       )
                               })
                          )
                    }
                 </div>
           </section>

           
           {
                selectedUser 
                ?
                (
                      <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                            <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                               <Avatar>
                                   <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                   <AvatarFallback>CN</AvatarFallback>
                               </Avatar>
                               <div className='flex flex-col'>
                                   <span>{selectedUser?.username}</span>
                               </div>
                           </div>
                           <Messages selectedUser={selectedUser} />
                           <div className='flex items-center p-4 border-t border-t-gray-300'>
                               <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages..." />
                               <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                           </div>
                      </section>
                )
                :
                (
                      <div className='flex flex-col items-center justify-center mx-auto'>
                          <MessageCircleCode className='w-32 h-32 my-4' />
                          <h1 className='font-medium'>Your messages</h1>
                          <span>Send a message to start a chat.</span>
                      </div>
                )
           }
            
    </div>
  )
};

export default Chatpage;
