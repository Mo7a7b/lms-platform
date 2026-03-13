import { getCourseById, GetUserData } from "@/lib/api";
import { CourseDetailWrapper } from "@/components/courses/ViewCourseSite/CourseDetailWrapper";
import Header from "@/components/home/Header";
import { cookies } from "next/headers";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const course = (await getCourseById(courseId)).course;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? (await GetUserData(token))?.user : null;

  return (
    <CourseDetailWrapper
      course={course}
      user={user}
      token={token}
      headerComponent={<Header />}
    />
  );
}
