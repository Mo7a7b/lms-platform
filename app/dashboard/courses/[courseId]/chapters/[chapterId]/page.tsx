"use client";
import dynamic from "next/dynamic";
const EditChapterView = dynamic(
  () => import("@/components/courses/Chapters/EditChapterView"),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  },
);
import { useAuthData } from "@/hooks/useAuthData";
import { useChapter } from "@/lib/queries/useChapter";
import { useCourse } from "@/lib/queries/useCourse";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { use } from "react";

export default function EditChapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = use(params);

  const { token, user } = useAuthData();

  const chapterResponse = useChapter(token as string, chapterId);
  const courseResponse = useCourse(courseId);

  return (
    <>
      {chapterResponse.isLoading || courseResponse.isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : !(
          chapterResponse.data ||
          chapterResponse.data.chapter ||
          courseResponse.data ||
          courseResponse.data.course
        ) ? (
        redirect("/dashboard/courses")
      ) : courseResponse.data.course.instructorId !== user.id ? (
        redirect("/dashboard/courses")
      ) : (
        <EditChapterView
          courseId={courseId}
          chapterId={chapterId}
          course={courseResponse.data.course}
          chapter={chapterResponse.data.chapter}
          token={token as string}
        />
      )}
    </>
  );
}
