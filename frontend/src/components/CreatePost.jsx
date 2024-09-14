import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";
import PropTypes from 'prop-types';
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { readFileAsDataURL } from "@/lib/utils";
import ImagePreviowdialog from "./ImagePreviowdialog";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector} from "react-redux";
import { setPostUser } from "@/redux/postSlice";



const CreatePost = ({ open, setOpen }) => {

    const ImageRef = useRef("");

    const [file,setFile] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [caption,setCaption] = useState("");

    const [imageOpen, setImageOpen] = useState(false);

    const [loading,setLoading] = useState(false);

    const dispatch = useDispatch();
    const posts = useSelector(store=>store.post.posts);  // need of {} as not default export
    const user=useSelector(store=>store.auth.user);

    const fileChangeHandler = async (e) => {
        e.preventDefault();
        const newfile = e.target.files?.[0];

        if (newfile) {
            setFile(newfile);
            const dataUrl = await readFileAsDataURL(newfile);
            setImagePreview(dataUrl);
        }
    };

    const CreatePostHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("caption", caption.trim()? "_"+caption :"_");
        if (imagePreview) formData.append("image", file);
        
        try { 
            setLoading(true);
            const res = await axios.post("http://localhost:8000/api/v1/post/addpost", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if(res.data.success)
                {
                    dispatch(setPostUser([res.data.post,...posts])) // look in dbs of addpost what u return res.data...look there...yes ..i return with post name
                    toast.success(res.data.message);      // ✨here dispatch new post and store in store 
                    setOpen(false);                               // ✨from <useGetAllPosts/> we dispatch all posts and store it in store
                    setImagePreview("");
                    setCaption("")
                    setFile("")
                }                                                       // ✨total posts are useselector by <Posts/>



        } catch (error) {
            console.error("Post creation failed:", error.message);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const CancelPostHandler=()=>{
        setImagePreview("");
        setFile("")
    }

    const handleDrop = async (e) => {
        e.preventDefault();
        const newfile = e.dataTransfer.files?.[0];

        if (newfile) {
            const dataUrl = await readFileAsDataURL(newfile);
            setImagePreview(dataUrl);
            setImageOpen(true);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <Dialog open={open} setOpen={setOpen}>
                <DialogOverlay/>
                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogTitle className="text-center font-semibold flex items-center border-b">
                        Create New Post
                    </DialogTitle>

                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-semibold text-xs">{user?.username}</h1>
                            <span className="text-gray-600 text-xs">{user?.bio}</span>
                        </div>
                    </div>

                    <Textarea value={caption} onChange={(e)=>{setCaption(e.target.value)}} className="focus-visible:ring-transparent border-none bg-gray-300" placeholder="Write a caption...."  />

                    {
                        imagePreview ?
                            <>
                                <div className="w-full h-64 flex items-center justify-center">
                                    <img src={imagePreview} className="object-cover w-full h-full rounded-md" alt="preview_img" />
                                </div>
                                <ImagePreviowdialog imagePreview={imagePreview} imageOpen={imageOpen} setImageOpen={setImageOpen} />
                            </>
                            :
                            <div
                                className="w-full h-64 flex flex-col items-center justify-center text-gray-500"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <svg aria-label="Icon to represent media such as images or videos" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96">
                                    <title>Icon to represent media such as images or videos</title>
                                    <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
                                    <path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
                                    <path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
                                </svg>
                                <span>Drag photos and videos here</span>
                            </div>
                    }


                    <input ref={ImageRef} onChange={fileChangeHandler} type="file" className="hidden" />


                    {
                        imagePreview ?
                        (
                           <div className="flex items-center gap-2 justify-evenly">
                                <Button className="cursor-pointer w-full bg-[#ED4950] hover:bg-[#ED4972] " onClick={CancelPostHandler}>Cancel</Button>
                                {loading ?
                                   ( <Button>
                                      <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                                      Please wait
                                    </Button>
                                   )
                                   :
                                   (
                                   <Button type="submit" className="w-full bg-[#258bcf] hover:bg-[#0095F6]" onClick={CreatePostHandler} >Post</Button>
                                   )
                                }
                           </div>
                        )
                        :
                        (
                        <Button onClick={() => { ImageRef.current.click() }} className="w-fit mx-auto bg-[#258bcf] hover:bg-[#0095F6]">Select from Computer</Button>
                        )
                    }

                   
                </DialogContent>
            </Dialog>
        </div>
    )
};

// Adding PropTypes for validation
CreatePost.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default CreatePost;
