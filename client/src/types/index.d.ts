import { Socket } from "socket.io-client";

export interface IUser {
  _id: string;
  name: string;
  socketId?: string;
}

export interface IContext {
  user: IUser | null;
  socket: Socket | null;
  isSocketConnected: boolean;
  activeUsers: IUser[];
  dispatch: React.Dispatch<IAction>;
}

// Base type for payload values
type PayloadValue = IUser | Socket | null;

type ActionMap<M extends Record<string, PayloadValue>> = {
  [Key in keyof M]: {
    type: Key;
    payload: M[Key];
  };
};

type Payload = {
  SET_USER: IUser | null;
  SET_SOCKET: Socket | null;
  SET_IS_SOCKET_CONNECTED: boolean;
  SET_ACTIVE_USERS: IUser[];
};

export type IAction = ActionMap<Payload>[keyof ActionMap<Payload>];
