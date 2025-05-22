import { SocketContext } from "@/context/SocketContext";
import React from "react";

export default function useSocket() {
  const socket = React.useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
}
