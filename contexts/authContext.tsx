"use client";
import { createContext } from "react";

const authContext = createContext<App.authContextType | null>(null);

export { authContext };
