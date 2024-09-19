import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPostUser } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import Commentdialog from "./Commentdialog";
import { Trash } from "lucide-react";

const Post = ({ post }) => {
  // 🔄 Move user initialization to the top
  const user = useSelector((store) => store.auth.user);
  const all_posts = useSelector((store) => store.post.posts);
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes?.includes(user._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  // Zoom effect on scrolling
  const postRef = useRef(null); // Reference to the post element
  const [isVisible, setIsVisible] = useState(false); // Track visibility

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting); // Set to true if post is in the viewport
      },
      { threshold: 0.7 } // Trigger when 50% of the post is visible
    );

    if (postRef.current) {
      observer.observe(postRef.current); // Observe the post element
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current); // Clean up observer
      }
    };
  }, []);

  const onChangeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const postDeleteHandler = async (e) => {
   e.preventDefault();
   try {
     const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, {
       withCredentials: true,
     });

     if (res.data.success) {
       const updated_for_all_posts = all_posts.filter(
         (each_post) => each_post?._id !== post?._id
       );
       dispatch(setPostUser(updated_for_all_posts));

       toast.success(res.data.message);
     }
   } catch (error) {
     console.log(error);
     const errorMessage = error.response?.data?.message || "An error occurred while deleting the post.";
     toast.error(errorMessage);
   }
 };

  const postLikeHandler = async (e) => {
    e.preventDefault();

    try {
      //1️⃣ task:1 =>for dbs---->permanent storage
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/like_or_dislike`,
        { withCredentials: true }
      );

      if (res.data.success) {
        //3️⃣ task:3 =>for UI  or to continue component
        setPostLike((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
        setLiked(!liked);

        //2️⃣ task:2 =>for reduxtoolkit---->to use it anywhere on UI
        const updated_Post_data = all_posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPostUser(updated_Post_data));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while liking/disliking the post.";
      toast.error(errorMessage);
    }
  };

  const commentAddHandler = async (e) => {
    e.preventDefault();

    try {
      //1️⃣ task:1 =>for dbs---->permanent storage
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        //2️⃣ task:2 =>for reduxtoolkit---->to use it anywhere on UI
        console.log(res.data.comment);
        const update_comment_data = [...comment, res.data.comment];

        const update_post_data = all_posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: update_comment_data }
            : p
        );

        dispatch(setPostUser(update_post_data));

        //3️⃣ task:3 =>for UI  or to continue component
        setComment(update_comment_data);

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
   <div
  ref={postRef} // Reference the post container
  className={`my-11 w-full max-w-sm mx-auto p-1 transform transition-transform duration-700 ${
    isVisible
      ? "scale-110 shadow-xl shadow-gray-800"
      : "scale-100"
  }`} // Apply the zoom effect and shadow
>
  {/* Post content */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={post.author?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <span>{post.author?.username}</span>
        {user?._id === post?.author?._id && <Badge>Author</Badge>}
      </div>
    </div>
    
    <div className="flex items-center">
      {user?._id === post?.author?._id && (
        <Trash
          className="cursor-pointer hover:text-red-500"
          onClick={postDeleteHandler}
          size={20}
        />
      )}
      <MoreHorizontal className="cursor-pointer ml-2" />
    </div>
  </div>

  <img
    className="rounded-lg w-full my-2 aspect-square object-cover"
    src={post.image}
    alt="post"
  />

  <div className="flex items-center justify-between my-2">
    <div className="flex items-center gap-3">
      {liked ? (
        <FaHeart onClick={postLikeHandler} size="22px" className="cursor-pointer" />
      ) : (
        <FaRegHeart onClick={postLikeHandler} size="22px" className="cursor-pointer hover:text-gray-600" />
      )}
      <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-600" />
      <Send className="cursor-pointer hover:text-gray-600" />
    </div>
    <Bookmark className="cursor-pointer hover:text-gray-600" />
  </div>

  <span className="font-medium block mb-2">{postLike || 0} likes</span>
  <p>
    <span className="font-medium mr-2">{post.author?.username}</span>
    {post.caption}
  </p>

  {comment.length > 0 && (
    <span onClick={() => setOpen(true)} className="cursor-pointer text-sm text-gray-400">
      View all {comment.length} comments
    </span>
  )}

  <Commentdialog open={open} setOpen={setOpen} />

  <div className="flex items-center justify-between">
    <input
      type="text"
      placeholder="Add a comment..."
      className="outline-none text-sm w-full"
      value={text}
      onChange={onChangeHandler}
    />
    {text && (
      <span className="cursor-pointer text-[#3BADF8]" onClick={commentAddHandler}>
        Post
      </span>
    )}
  </div>
</div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Post;
