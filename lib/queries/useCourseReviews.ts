import useSWR from "swr";
import { fetcher } from "../http/httpClient";

export function useCourseReviews(
  courseId: string,
  page: number = 1,
  limit: number = 5,
) {
  return useSWR(
    `/review/course/${courseId}?page=${page}&limit=${limit}`,
    fetcher,
  );
}
