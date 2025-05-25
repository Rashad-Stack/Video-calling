import type { IAction, IContext } from "@/types";

// Reducer
const reducers = (state: IContext, action: IAction): IContext => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "SET_SOCKET":
      return {
        ...state,
        socket: action.payload,
      };

    case "SET_IS_SOCKET_CONNECTED":
      return {
        ...state,
        isSocketConnected: action.payload,
      };

    case "SET_ACTIVE_USERS":
      return {
        ...state,
        activeUsers: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
