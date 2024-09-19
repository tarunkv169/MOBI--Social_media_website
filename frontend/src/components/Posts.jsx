import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  const posts = useSelector(store => store.post.posts);  // as we r directly destructing ...no need of {posts}, if we do "store.post"-only then we need
  console.log(posts)
  if (!posts) {
    return <p>Loading posts...</p>;
}

if (posts.length === 0) {
    return <p>No posts available.</p>;
}
  return (
    <div>

      {posts && posts.length > 0 ? ( posts.map(post => (post && post._id ? <Post key={post._id} post={post} /> : null))) : ( <p>No posts available</p>)}

    </div>
  );
};

export default Posts;
