import { getAllCourses } from "@/lib/api";
import { CourseDiscovery } from "@/components/courses/ViewCourseSite/CourseDiscovery";
import Header from "@/components/home/Header";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Academos - Courses",
  description: "Academos Courses",
};

export default async function CoursesPage() {
  const result = await getAllCourses();
  const courses: App.Course[] = result.courses || [];

  return (
    <>
      <div className="bg-gradient-to-r from-[#2c1b49] to-[#241e47] text-white pt-5">
        <Header />
      </div>
      <CourseDiscovery courses={courses} />
    </>
  );
}
