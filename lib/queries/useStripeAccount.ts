import useSWR from "swr";
import { fetcherWithToken } from "../http/httpClient";

export function useStripeAccount(token: string) {
  return useSWR(["/stripe/connect/status", token], fetcherWithToken);
}
