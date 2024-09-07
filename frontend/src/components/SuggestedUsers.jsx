import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
    const suggestedUsers = useSelector(store => store.auth.suggestedUsers) || [];  // Fallback to an empty array

    return (
        <div className="my-10">
            <div className="flex items-center justify-between text-sm">
                <h1 className="font-semibold text-gray-600">Suggested Users</h1>
                <span className="font-medium cursor-pointer">See All</span>
            </div>

            {suggestedUsers.length === 0 ? 
            (
                <p className="my-5">No suggested users found.</p>
            ) 
            : 
            (
                suggestedUsers?.map((user) => (
                    <div key={user?._id} className="flex items-center justify-between my-5">
                           <div className="flex items-center gap-2">
                               <Link to={`/profile/${user?._id}`}>
                                   <Avatar>
                                       <AvatarImage src={user?.profilePicture} />
                                       <AvatarFallback>CN</AvatarFallback>
                                   </Avatar>
                               </Link>
   
                               <div>
                                   <h1 className="font-semibold text-sm">
                                       <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                   </h1>
                                   <span className="text-gray-600 text-sm">{user?.bio || 'bio here....'}</span>
                               </div>
   
                           </div>
                           <button className="font-bold text-xs cursor-pointer text-[#3BADF8] hover:text-[#3495d6]">Follow</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SuggestedUsers;
