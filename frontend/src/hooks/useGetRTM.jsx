import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetRTM = () => {
    const socket = useSelector(store=>store.socketio.socket);
    const messages = useSelector(store=>store.chat.messages);
    const dispatch = useDispatch();

    useEffect(() => {
      // Ensure socket is available
      if (!socket) return;

      const handleNewMessage = (newMsg) => {
          dispatch(setMessages([...messages, newMsg]));
      };

      // Register event listener for new messages
      socket.on("newMsg", handleNewMessage);

      // Clean up the event listener when component unmounts or dependencies change
      return () => {
          socket.off("newMsg", handleNewMessage);
      };
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);
};

export default useGetRTM;
