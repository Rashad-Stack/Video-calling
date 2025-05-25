import type { IContext } from "@/types";
import React from "react";

export const Context = React.createContext<IContext | null>(null);
