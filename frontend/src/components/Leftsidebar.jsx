import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import CreatePost from "./CreatePost";


const Leftsidebar = () => {

    const navigate = useNavigate();
    
    // login of sidebarHandler
    const logoutHandler=async()=>{
        try {
             const res = await axios.get("http://localhost:8000/api/v1/user/logout",{withCredentials:true})
       
             if(res.data.success)
             {
                navigate("/login")
                toast.success(res.data.message);
             }
          } catch (error) {
             console.log(error);
             toast.error(error.response.data.message);
          }
    }    
    
    // Create of sidebarHandler
    const [open,setOpen] = useState(false)
    const CreateHandler=()=>{
         setOpen(true);
    }
    
    // onclick icon sidebarhandler
    const sidebarHandler=(text_type)=>{
         if(text_type==="Logout")
          {
             logoutHandler();
          }else if(text_type==="Create"){
             CreateHandler();
          } 
    }

    // picking up userDetails from store of redux-toolkit  
    const user = useSelector((store)=>store.auth.user)  // either look 
    
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

