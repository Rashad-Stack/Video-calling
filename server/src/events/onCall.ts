import { io } from "../app";
import { Participant } from "../types";

export default function onCall(participant: Participant) {
  if (participant.receiver.socketId) {
    io.to(participant.receiver.socketId).emit("incomingCall", participant);
  }
}
