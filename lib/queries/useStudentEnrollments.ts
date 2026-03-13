import useSWR from "swr";
import { fetcherWithToken } from "../http/httpClient";

export function useStudentEnrollments(token: string) {
  return useSWR<{ message: string; enrollments: App.Enrollment[] }>(
    ["/enrollment", token],
    fetcherWithToken,
  );
}
