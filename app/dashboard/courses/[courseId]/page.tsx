import dynamic from "next/dynamic";
const EditCourseView = dynamic(
  () => import("@/components/courses/EditCourse/EditCourseView"),
);
import { getCourseById } from "@/lib/api";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const data = await getCourseById(courseId);

  const course = data?.course;

  return (
    <div className="h-full p-6">
      <EditCourseView course={course} />
    </div>
  );
}
