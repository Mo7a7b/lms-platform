import useSWR from "swr";
import { fetcher } from "../http/httpClient";

export function useCourse(id: string) {
  return useSWR(`/course/${id}`, fetcher);
}
