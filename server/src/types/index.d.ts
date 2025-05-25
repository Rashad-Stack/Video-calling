export interface IUser {
  _id: string;
  name: string;
  socketId?: string;
}

export type Participant = {
  caller: IUser;
  receiver: IUser;
};
