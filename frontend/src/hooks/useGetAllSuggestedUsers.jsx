import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSuggestedUsers=async()=>{
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/suggested_users',{withCredentials:true});

                if(res.data.success)
                {
                   dispatch(setSuggestedUsers(res.data.users))
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchSuggestedUsers();
        
    },[dispatch])


};

export default useGetAllSuggestedUsers;
