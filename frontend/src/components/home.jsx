import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";



const Home = () => {
  useGetAllPosts();
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
