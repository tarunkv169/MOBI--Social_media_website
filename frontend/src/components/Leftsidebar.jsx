import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setAuthUser } from "@/redux/authSlice";
import { setPostUser, setSelectedPost } from "@/redux/postSlice";



const Leftsidebar = () => {

    const navigate = useNavigate();
    const [open,setOpen] = useState(false)
    const user = useSelector((store)=>store.auth.user)
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    

    const logoutHandler=async()=>{
        try {
             const res = await axios.get("http://localhost:8000/api/v1/user/logout",{withCredentials:true})
       
             if(res.data.success)
             {
              dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPostUser([]));
                navigate("/login")
                toast.success(res.data.message);
             }
          } catch (error) {
             console.log(error);
             toast.error(error.response.data.message);
          }
    }    
    

    const CreateHandler=()=>{
         setOpen(true);
    }
    
    const sidebarHandler=(text_type)=>{
         if(text_type==="Logout")
          {
             logoutHandler();
          }else if(text_type==="Create"){
             CreateHandler();
          }else if(text_type==="Profile"){
             navigate(`/profile/${user._id}`)
          }else if(text_type==="Home")
          {
            navigate('/');
          }else if(text_type==="Messages")
          {
             navigate("/chatpage")
          }
    }

    
    // arr of objs
     const sidebarItems = 
     [
       { icon: <Home />, text: "Home" },
       { icon: <Search />, text: "Search" },
       { icon: <TrendingUp />, text: "Explore" },
       { icon: <MessageCircle />, text: "Messages" },
       { icon: <Heart />, text: "Notifications" },
       { icon: <PlusSquare />, text: "Create" },
       {
         icon: (<Avatar className='w-6 h-6'>
           <AvatarImage src={user?.profilePicture} />
           <AvatarFallback>CN</AvatarFallback>
         </Avatar>), text: "Profile"
       },
       { icon: <LogOut />, text: "Logout" }
   
     ]


   // iterating each 'obj of arr' using map()
  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col">
            <h1 className="my-8 pl-3 font-bold text-xl">MOBI</h1>
             {
                sidebarItems.map((item,index)=>{
                  return (
                    <div onClick={()=>(sidebarHandler(item.text))} key={index} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2">
                         {item.icon}
                         <span>{item.text}</span>
                         {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                      }
                    </div>
                  )
                  
                })
                   
             }
        </div>

        <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
};

export default Leftsidebar;

