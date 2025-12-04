import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import MessagesBook from "./MessagesBook"

const MessagesPage: React.FC = () => {
  const { user } = useSelector(selectAuth);

  // No logged-in user
  if (!user) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        No user is logged in.
      </div>
    );
  }

  // Map Redux user to MessagesBook format
  const mappedUser = {
    name: user.name,
    title: user.role === "judge" ? "Presiding Judge" : "Administrator",
    image:
      "https://res.cloudinary.com/drls2cpnu/image/upload/v1764746866/Justice_e548ka.jpg",
  };

  return (
    <div className="w-full flex justify-center">
      <MessagesBook user={mappedUser} />
    </div>
  );
};

export default MessagesPage;
