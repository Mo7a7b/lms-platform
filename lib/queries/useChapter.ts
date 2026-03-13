import useSWR from "swr";
import { fetcherWithToken } from "../http/httpClient";

export function useChapter(token: string, id: string) {
  return useSWR([`/chapter/${id}`, token], fetcherWithToken);
}
