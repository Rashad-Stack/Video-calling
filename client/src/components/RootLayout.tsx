import useContext from "@/hooks/useContext";
import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLoaderData } from "react-router";
import Header from "./Header";

export default function RootLayout() {
  const { dispatch } = useContext();
  const user = useLoaderData();

  useEffect(() => {
    dispatch({ type: "SET_USER", payload: user });
  }, [dispatch, user]);

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 ">
        <Outlet />
        <ScrollRestoration />
      </main>
    </div>
  );
}
