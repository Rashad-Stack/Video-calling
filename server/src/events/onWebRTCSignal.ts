import { io } from "../app";
import { SignalData } from "../types";

export default async function onWebRTCSignal(data: SignalData) {
  console.log("onWebRTCSignal called with:", data);

  if (data.isCaller) {
    const receiverId = data.onGoingCall?.participants?.receiver?.socketId;
    console.log("Sending signal to receiver:", receiverId);
    if (receiverId) {
      io.to(receiverId).emit("webRTCSignal", data);
    }
  } else {
    const callerId = data.onGoingCall?.participants?.caller?.socketId;
    console.log("Sending signal to caller:", callerId);
    if (callerId) {
      io.to(callerId).emit("webRTCSignal", data);
    }
  }
}
