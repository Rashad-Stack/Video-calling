import RootLayout from "@/components/RootLayout";
import { getCurrentUser, login, logout, register } from "@/lib/services";
import Error from "@/pages/Error";
import Home from "@/pages/Home";
import HydrateFallback from "@/pages/HydrateFallback";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    hydrateFallbackElement: <HydrateFallback />,
    errorElement: <Error />,
    loader: getCurrentUser,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "sign-in",
    element: <Login />,
    action: login,
  },
  {
    path: "sign-up",
    element: <Register />,
    action: register,
  },
  {
    path: "sign-out",
    loader: logout,
  },
]);

export default router;
