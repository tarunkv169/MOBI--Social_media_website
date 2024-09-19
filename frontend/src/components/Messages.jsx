import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import PropTypes from 'prop-types';
import useGetRTM from "@/hooks/useGetRTM";
import useGetAllMessages from "@/hooks/useGetAllMessages";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessages();
  const messages = useSelector((store) => store.chat.messages);
  const user = useSelector((store) => store.auth.user);
  const messagesEndRef = useRef(null); // Create a ref for the end of the messages

  // Scroll to the bottom of the messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg?._id}
              className={`flex ${
                msg?.senderId === user?._id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg?.senderId === user?._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <span>No messages yet</span>
        )}
        {/* Add a div for scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

Messages.propTypes = {
  selectedUser: PropTypes.object.isRequired,
};

export default Messages;
