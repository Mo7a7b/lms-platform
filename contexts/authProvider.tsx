"use client";

import { authContext } from "./authContext";

export default function AuthProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: App.authContextType;
}) {
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
