import { authContext } from "@/contexts/authContext";
import { useContext } from "react";

export function useAuthData() {
  const { user, token } = useContext(authContext) as App.authContextType;
  if (!user || !token) {
    throw new Error("No auth data found");
  }
  return { user, token };
}
