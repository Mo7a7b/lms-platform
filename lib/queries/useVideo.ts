import useSWR from "swr";
import { fetcherWithToken } from "../http/httpClient";

export function useVideo(token: string, id: string) {
  return useSWR([`/video/${id}`, token], fetcherWithToken);
}
