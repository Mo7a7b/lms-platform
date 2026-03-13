"use client";
import EditVideoView from "@/components/courses/Videos/EditVideoView";
import { redirect } from "next/navigation";
import { use } from "react";
import { useAuthData } from "@/hooks/useAuthData";
import { useCourse } from "@/lib/queries/useCourse";
import { useVideo } from "@/lib/queries/useVideo";
import { Loader2 } from "lucide-react";

const EditVideoPage = ({
  params,
}: {
  params: Promise<{
    courseId: string;
    chapterId: string;
    videoId: string;
  }>;
}) => {
  const { courseId, chapterId, videoId } = use(params);
  const { token, user } = useAuthData();
  const courseResponse = useCourse(courseId);

  const videoResponse = useVideo(token, videoId);

  return (
    <>
      {videoResponse.isLoading || courseResponse.isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : !(
          videoResponse.data ||
          videoResponse.data.video ||
          courseResponse.data ||
          courseResponse.data.course
        ) ? (
        redirect("/dashboard/courses")
      ) : courseResponse.data.course.instructorId !== user.id ? (
        redirect("/dashboard/courses")
      ) : (
        <EditVideoView
          courseId={courseId}
          chapterId={chapterId}
          videoId={videoId}
          token={token}
          video={videoResponse.data.video}
        />
      )}
    </>
  );
};

export default EditVideoPage;
