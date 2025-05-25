import { Context } from "@/context/Context";
import React from "react";

export default function useContext() {
  const state = React.useContext(Context);

  if (!state) {
    throw new Error("useContext must be used within a Provider");
  }
  return { ...state };
}
