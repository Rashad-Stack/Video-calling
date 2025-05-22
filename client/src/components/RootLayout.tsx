import { Outlet, ScrollRestoration } from "react-router";
import Header from "./Header";

export default function RootLayout() {
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
