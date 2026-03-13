import dynamic from "next/dynamic";

const InstructorCourses = dynamic(
  () => import("@/components/courses/ViewCourseDashboard/InstructorCourses"),
);
const AddNewCourseButton = dynamic(
  () => import("@/components/courses/CreateCourse/AddNewCourseButton"),
);
const StudentCourses = dynamic(
  () => import("@/components/courses/ViewCourseDashboard/StudentCourses"),
);
import { cookies } from "next/headers";
import { GetUserData } from "@/lib/api";

export default async function CoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = await GetUserData(token as string);
  const role = user.role;

  return (
    <div className="min-h-screen p-6 bg-muted space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {role === "Student" ? "My Courses" : "Manage Courses"}
        </h1>
        {role === "Instructor" && <AddNewCourseButton />}
      </div>
      {role === "Student" ? <StudentCourses /> : <InstructorCourses />}
    </div>
  );
}
