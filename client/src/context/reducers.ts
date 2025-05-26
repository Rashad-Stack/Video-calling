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

    case "SET_ON_GOING_CALL":
      return {
        ...state,
        ongoingCall: action.payload,
      };

    case "SET_LOCAL_STREAM":
      return {
        ...state,
        localStream: action.payload,
      };

    case "SET_PEER":
      if (state.peer && action?.payload?.stream) {
        return {
          ...state,
          peer: {
            ...state.peer,
            stream: action.payload.stream,
          },
        };
      }
      return {
        ...state,
        peer: action.payload,
      };

    default:
      return state;
  }
};

export default reducers;
