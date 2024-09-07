import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetAllSuggestedUsers from "@/hooks/useGetAllSuggestedUsers";



const Home = () => {
  useGetAllPosts();
  useGetAllSuggestedUsers();
  return (
    <div className="flex">
        <div className="flex-grow">
          <Feed/>
          <Outlet/>
        </div>
       <Rightsidebar/>

    </div>   

  )
};

export default Home;
