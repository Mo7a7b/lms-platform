import useSWRMutation from "swr/mutation";
import { signIn } from "@/lib/api";

export function useLogin() {
  return useSWRMutation("/auth/signin", signIn, {
    onError(err) {
      return err;
    },
    onSuccess(data) {
      return data;
    },
  });
}
