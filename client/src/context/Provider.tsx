import type { IContext, IUser, OngoingCall, Participant } from "@/types";
import { useCallback, useEffect, useReducer } from "react";
import Peer, { type SignalData } from "simple-peer";
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

  const {
    user,
    socket,
    isSocketConnected,
    activeUsers,
    localStream,
    peer,
    ongoingCall,
  } = state;

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
        if (videoDevices.length === 0) {
          console.error("No video input devices found.");
          return null;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (facingMode) {
          const videoTrack = stream.getVideoTracks()[0];
          videoTrack.applyConstraints({
            facingMode: { exact: facingMode },
          });
        }

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

  const handleHangup = useCallback(({}) => {}, []);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      if (!stream) {
        console.error("No stream provided to createPeer");
        return null;
      }

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

      console.log(
        "Creating peer with stream:",
        stream,
        "initiator:",
        initiator
      );

      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers },
      });

      peer.on("stream", (remoteStream) => {
        console.log("Received remote stream:", remoteStream);
        dispatch({
          type: "SET_PEER",
          payload: { stream: remoteStream },
        });
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
      });

      peer.on("close", () => handleHangup({}));

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
      rtcPeerConnection.oniceconnectionstatechange = () => {
        if (
          ["disconnected", "closed", "failed"].includes(
            rtcPeerConnection.iceConnectionState
          )
        ) {
          handleHangup({});
        }
      };

      console.log("Peer created:", peer);

      return peer;
    },
    [handleHangup]
  );

  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: RTCSessionDescriptionInit;
      onGoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      console.log("Complete peer connection with data:", connectionData);
      if (!localStream) return console.log("No local stream available");

      // If peer already exists, just signal it
      if (peer && peer.peerConnection) {
        return peer.peerConnection.signal(connectionData.sdp);
      }

      // 1. Create peer with correct initiator flag
      const newPeer = createPeer(localStream, connectionData.isCaller);

      if (!newPeer) return console.log("Error creating peer connection");

      // 2. Attach event handlers BEFORE signaling
      newPeer.on("signal", (data: SignalData) => {
        console.log("Signal data:", data);
        if (!socket || !currentSocketUser) return;
        console.log("Signaling data:", data);
        socket.emit("webRTCSignal", {
          sdp: data,
          ongoingCall,
          isCaller: connectionData.isCaller,
        });
      });

      newPeer.on("error", (err) => {
        console.error("Peer error:", err);
      });

      // 3. Save peer instance in state
      dispatch({
        type: "SET_PEER",
        payload: {
          peerConnection: newPeer,
          participantUser: connectionData.onGoingCall.participants.receiver,
        },
      });

      // 4. Signal the peer with the received SDP if you are NOT the caller (callee)
      if (!connectionData.isCaller) {
        newPeer.signal(connectionData.sdp);
      }
    },
    [createPeer, currentSocketUser, localStream, ongoingCall, peer, socket]
  );

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
      const newPeer = createPeer(stream, false);

      if (!newPeer) return console.log("Error creating peer connection");

      // Attach handlers BEFORE dispatch or signaling
      newPeer.on("signal", (data: SignalData) => {
        if (!socket || !currentSocketUser) return;
        socket.emit("webRTCSignal", {
          sdp: data,
          ongoingCall: onGoingCall, // use the same property name everywhere
          isCaller: false,
        });
      });

      newPeer.on("stream", (remoteStream) => {
        console.log("Received remote stream:", remoteStream);
        dispatch({
          type: "SET_PEER",
          payload: { stream: remoteStream },
        });
      });

      newPeer.on("error", (err) => {
        console.error("Peer error:", err);
      });

      dispatch({
        type: "SET_PEER",
        payload: {
          peerConnection: newPeer,
          participantUser: onGoingCall.participants.caller,
        },
      });
    },
    [createPeer, currentSocketUser, getMediaStream, socket]
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
    socket.on("webRTCSignal", completePeerConnection);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webRTCSignal", completePeerConnection);
    };
  }, [socket, currentSocketUser, onIncomingCall, completePeerConnection]);

  return (
    <Context.Provider
      value={{ ...state, dispatch, handleCall, handleJoinCall }}>
      {children}
    </Context.Provider>
  );
}
