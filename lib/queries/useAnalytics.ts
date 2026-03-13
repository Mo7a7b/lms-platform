import { fetcherWithToken } from "../http/httpClient";
import useSWR from "swr";

export function useAnalytics(token: string) {
  return useSWR(["/analytics/instructor", token], fetcherWithToken);
}
