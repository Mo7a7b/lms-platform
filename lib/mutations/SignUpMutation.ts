import useSWRMutation from "swr/mutation";
import { signUp } from "@/lib/api";

export function useSignUp() {
  return useSWRMutation("/auth/signup", signUp, {
    onError(err) {
      return err;
    },
    onSuccess(data) {
      return data;
    },
  });
}
