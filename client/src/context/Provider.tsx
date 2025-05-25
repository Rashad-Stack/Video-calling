import type { IContext, IUser } from "@/types";
import { useEffect, useReducer } from "react";
import { io } from "socket.io-client";
import { Context } from "./Context";
import reducers from "./reducers";

// Initial state
const initialState: IContext = {
  user: null,
  socket: null,
  isSocketConnected: false,
  activeUsers: [],
  dispatch: () => null,
};

interface IProvider {
  children: React.ReactNode;
}

// Create context

export default function Provider({ children }: IProvider) {
  const [state, dispatch] = useReducer(reducers, initialState);

  const { user, socket, isSocketConnected } = state;

  console.log("isSocketConnected", isSocketConnected);

  // initialize Socket
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    dispatch({ type: "SET_SOCKET", payload: newSocket });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () =>
      dispatch({ type: "SET_IS_SOCKET_CONNECTED", payload: true });
    const onDisconnect = () =>
      dispatch({ type: "SET_IS_SOCKET_CONNECTED", payload: false });

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.emit("addNewUser", user);

    socket.on("getUsers", (users: IUser[]) => {
      dispatch({ type: "SET_ACTIVE_USERS", payload: users });
    });
  }, [isSocketConnected, socket, user]);

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
}
