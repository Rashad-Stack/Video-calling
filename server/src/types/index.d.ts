export interface IUser {
  _id: string;
  name: string;
  socketId?: string;
}

export type Participant = {
  caller: IUser;
  receiver: IUser;
};

export type OngoingCall = {
  participants: Participant;
  isCalling: boolean;
};

export type SignalData = {
  sdp: RTCSessionDescriptionInit;
  onGoingCall: OngoingCall;
  isCaller: boolean;
};
