import { RouterProvider } from "react-router";
import Provider from "./context/Provider";
import router from "./routes";

function App() {
  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
