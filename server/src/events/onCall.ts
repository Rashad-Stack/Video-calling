import { io } from "../app";
import { Participant } from "../types";

export default function onCall(participant: Participant) {
  if (participant.receiver.socketId) {
    console.log(
      "onCall: Relaying call to receiver:",
      participant.receiver.socketId,
    );
    io.to(participant.receiver.socketId).emit("incomingCall", participant);
  } else {
    console.warn("onCall: No receiver socketId found", participant.receiver);
  }
}
