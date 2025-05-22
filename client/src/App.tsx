import { RouterProvider } from "react-router";
import SocketProvider from "./context/SocketProvider";
import router from "./routes";

function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  );
}

export default App;
