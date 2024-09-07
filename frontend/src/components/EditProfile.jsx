import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setPostUser } from "@/redux/postSlice";


const EditProfile = () => {
    const user = useSelector(store=>store.auth.user);
    const all_posts = useSelector(store=>store.post.posts);

    const imageRef = useRef()
    const [input,setInput]=useState({
        profilePhoto:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [loading,setLoading] = useState(false);

    const changeProfilePhotoHandler=async(e)=>{
        const file = e.target.files?.[0];
        if(file)
        {
            setInput({...input,profilePhoto:file});
        }   
    }

    const changeBioHandler=async(e)=>{
        const new_bio = e.target.value;
        setInput({...input,bio:new_bio});
    }

    const changeSelectHandler = (new_gender) => {
        setInput({ ...input, gender: new_gender });
    };
    

    const editProfileHandler=async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("bio",input.bio);
        formData.append("gender", input.gender);
        if(input.profilePhoto){formData.append("profilePhoto", input.profilePhoto)}
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit',formData,{
                headers:{
                    "Content-Type":"multipart/form-Data"
                },
                withCredentials:true
            })

            if(res.data.success)
            {
                const updata_edit_user = {
                    ...user,
                    bio:res.data.user?.bio,
                    gender:res.data.user?.gender,
                    profilePicture:res.data.user?.profilePicture    
                }

                dispatch(setAuthUser(updata_edit_user));
                const updatedPosts = all_posts.map((post) => 
                    post.author._id === user._id
                    ? { ...post, author: { ...post.author, bio: res.data.user?.bio, profilePicture: res.data.user?.profilePicture } }
                    : post
                );
    
                dispatch(setPostUser(updatedPosts));
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex max-w-2xl mx-auto pl-10 ">
        
            <section className="flex flex-col gap-6 w-full my-6">

                    <h1 className='font-bold text-xl'>Edit Profile</h1> 

                    <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
                         <div className='flex items-center gap-3'>
                                 <Avatar className="h-12 w-12">
                                     <AvatarImage src={user?.profilePicture} />
                                     <AvatarFallback>CN</AvatarFallback>
                                 </Avatar>
                             <div>
                                 <h1 className='font-semibold text-sm'>{user?.username}</h1>
                                 <span className="text-gray-600 text-sm">{user?.bio || 'bio here....'}</span>
                             </div>
                         </div>

                         <input onChange={changeProfilePhotoHandler}   ref={imageRef} type='file' className="hidden"/>
                         <Button onClick={()=>imageRef?.current.click()} className="bg-[#0095F6] h-8 hover:bg-[#318bc7]" >Change Photo</Button>
                    </div>

                    <div>
                        <h1 className='font-bold text-xl mb-2'>Bio</h1>
                        <Textarea value={input.bio} onChange={changeBioHandler} className="focus-visible:ring-transparent"/>
                    </div>

                    <div>
                        <h1 className='font-bold text-xl mb-2'>Gender</h1>
                        <Select defaultValue={input.gender} onValueChange={changeSelectHandler}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

    
                    </div>

                    <div className="flex justify-end">
                        {
                            loading 
                            ?
                            (
                              <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                Please wait
                              </Button>
                            )
                            :
                            <Button onClick={editProfileHandler} className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">Submit</Button>
                        }
                    </div>
            </section>
        </div>
    )
};

export default EditProfile;
