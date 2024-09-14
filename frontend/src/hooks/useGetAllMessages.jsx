import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
    const selectedUser = useSelector(store => store.auth.selectedUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });

                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        if (selectedUser?._id) {
            fetchAllMessages();
        }
    }, [selectedUser, dispatch]);
};

export default useGetAllMessages;
