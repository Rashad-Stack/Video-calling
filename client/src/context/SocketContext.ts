import React from "react";
import type { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);
