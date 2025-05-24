import { Outlet, ScrollRestoration, useLoaderData } from "react-router";
import Header from "./Header";

export default function RootLayout() {
  const user = useLoaderData();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header user={user} />
      <main className="flex-1 ">
        <Outlet />
        <ScrollRestoration />
      </main>
    </div>
  );
}
