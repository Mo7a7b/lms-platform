import useSWRMutation from "swr/mutation";
import { CreateCourse } from "../api";
import { useInstructorCourses } from "../queries/useInstructorCourses";
import { toast } from "sonner";

export function useCreateCourse(token: string) {
  const { mutate } = useInstructorCourses(token);
  return useSWRMutation("/course", CreateCourse, {
    onError(err) {
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "An unknown error occurred",
      );
    },
    onSuccess() {
      toast.success("Course created successfully");
      mutate();
    },
  });
}
