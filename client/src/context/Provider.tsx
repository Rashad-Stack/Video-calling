import type { IContext, IUser, OngoingCall, Participant } from "@/types";
import { useCallback, useEffect, useReducer } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { Context } from "./Context";
import reducers from "./reducers";

// Initial state
const initialState: IContext = {
  user: null,
  socket: null,
  isSocketConnected: false,
  activeUsers: [],
  ongoingCall: null,
  localStream: null,
  peer: null,
  dispatch: () => null,
  handleCall: () => null,
  handleJoinCall: () => null,
};

interface IProvider {
  children: React.ReactNode;
}

// Create context

export default function Provider({ children }: IProvider) {
  const [state, dispatch] = useReducer(reducers, initialState);

  const { user, socket, isSocketConnected, activeUsers, localStream, peer } =
    state;

  console.log("isSocketConnected", isSocketConnected);

  const currentSocketUser = activeUsers?.find((u) => u._id === user?._id);

  const getMediaStream = useCallback(
    async (facingMode?: string) => {
      if (localStream) return localStream;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: {
              min: 640,
              ideal: 1280,
              max: 1920,
            },
            height: {
              min: 360,
              ideal: 720,
              max: 1080,
            },
            frameRate: {
              min: 16,
              ideal: 30,
              max: 30,
            },
            facingMode: videoDevices.length > 1 ? facingMode : undefined,
          },
        });

        dispatch({ type: "SET_LOCAL_STREAM", payload: stream });
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        dispatch({ type: "SET_LOCAL_STREAM", payload: null });
        return null;
      }
    },
    [localStream]
  );

  const handleCall = useCallback(
    async (user: IUser) => {
      if (!socket || !currentSocketUser) return;

      const stream = await getMediaStream();
      if (!stream) return console.log("Error accessing media devices");

      const participants = { caller: currentSocketUser, receiver: user };
      dispatch({
        type: "SET_ON_GOING_CALL",
        payload: { participants, isCalling: false },
      });

      socket.emit("callUser", participants);
    },
    [socket, currentSocketUser, getMediaStream]
  );

  const onIncomingCall = useCallback((participants: Participant) => {
    dispatch({
      type: "SET_ON_GOING_CALL",
      payload: { participants, isCalling: true },
    });
  }, []);

  const createPeer = useCallback((stream: MediaStream, initiator: boolean) => {
    const iceServers: RTCIceServer[] = [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
        ],
      },
    ];

    const peer = new Peer({
      stream,
      initiator,
      trickle: true,
      config: { iceServers },
    });

    peer.on("stream", (stream) => {
      dispatch({
        type: "SET_PEER",
        payload: { stream },
      });
    });
  }, []);

  const handleJoinCall = useCallback(
    async (onGoingCall: OngoingCall) => {
      if (!socket || !currentSocketUser) return;
      console.log("onGoingCall", onGoingCall);

      dispatch({
        type: "SET_ON_GOING_CALL",
        payload: { ...onGoingCall, isCalling: false },
      });

      const stream = await getMediaStream();

      if (!stream) return console.log("Error accessing media devices");
    },
    [currentSocketUser, getMediaStream, socket]
  );

  // initialize Socket
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    dispatch({ type: "SET_SOCKET", payload: newSocket });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket connection
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

  // Set online users
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.emit("addNewUser", user);

    socket.on("getUsers", (users: IUser[]) => {
      dispatch({ type: "SET_ACTIVE_USERS", payload: users });
    });

    return () => {
      socket.off("getUsers", (users: IUser[]) => {
        dispatch({ type: "SET_ACTIVE_USERS", payload: users });
      });
    };
  }, [isSocketConnected, socket, user]);

  // Handle calls
  useEffect(() => {
    if (!socket || !currentSocketUser) return;

    socket.on("incomingCall", onIncomingCall);

    return () => {
      socket.off("incomingCall", onIncomingCall);
    };
  }, [socket, currentSocketUser, onIncomingCall]);

  return (
    <Context.Provider
      value={{ ...state, dispatch, handleCall, handleJoinCall }}>
      {children}
    </Context.Provider>
  );
}
