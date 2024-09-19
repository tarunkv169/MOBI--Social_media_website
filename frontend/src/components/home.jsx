import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetAllSuggestedUsers from "@/hooks/useGetAllSuggestedUsers";
import { useSelector } from "react-redux";

const Home = () => {
  useGetAllPosts();
  useGetAllSuggestedUsers();

  // Get posts from Redux store
  const posts = useSelector((state) => state.posts);

  console.log(posts); // Log posts from Redux store

  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <Rightsidebar />
    </div>
  );
};

export default Home;
