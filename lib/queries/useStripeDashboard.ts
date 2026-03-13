import useSWR from "swr";
import { fetcherWithToken } from "../http/httpClient";

export function useStripeDashboard(token: string) {
  return useSWR(["/stripe/dashboard", token], fetcherWithToken);
}
