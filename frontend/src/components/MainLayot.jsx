import { Outlet } from "react-router-dom";
import Leftsidebar from "./Leftsidebar";

/*at place of outlet---any of child of mainlayot----> which is onClick in leftsidebar---is visible */
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
