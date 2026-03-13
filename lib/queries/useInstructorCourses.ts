import useSWR from "swr";
import { fetcherWithToken } from "../http/httpClient";

export function useInstructorCourses(token: string) {
  return useSWR(["/course/instructor", token], fetcherWithToken);
}
