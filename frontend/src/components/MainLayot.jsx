import { Outlet } from "react-router-dom";
import Leftsidebar from "./Leftsidebar";


const MainLayot = () => {
  return (
    <div>
        <Leftsidebar/>
        <div>
            <Outlet/>
        </div>
    </div>
    
  )
 
};

export default MainLayot;
