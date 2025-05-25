import useContext from "@/hooks/useContext";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function OnlineUserList() {
  const { user, activeUsers, handleCall } = useContext();

  return (
    <div>
      <h2>Online Users</h2>
      <ul className="flex gap-4 flex-wrap">
        {activeUsers.length > 0 &&
          activeUsers.map((activeUser) => {
            if (user?._id === activeUser._id) return null;

            return (
              <li
                key={activeUser._id}
                onClick={() => handleCall(activeUser)}
                className="flex items-center gap-2 flex-col bg-gray-200 rounded-lg py-4 cursor-pointer">
                <Avatar className="w-48">
                  <AvatarImage src={activeUser.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {activeUser.name}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
