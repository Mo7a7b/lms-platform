"use client";

import { useState } from "react";
import { CourseMarketingView } from "./CourseMarketingView";
import { CoursePlayerView } from "./CoursePlayerView";
import { Button } from "@/components/ui/button";

import { CourseClassroomHeader } from "../ViewCourseSite/CourseClassroomHeader";
import { ArrowLeft } from "lucide-react";

import { enrollIntoCourse } from "@/lib/api/stripe.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CourseDetailWrapperProps {
  course: App.Course;
  user?: App.authContextType["user"] | null;
  token?: string | null;
  headerComponent?: React.ReactNode;
}

export function CourseDetailWrapper({
  course,
  user,
  token,
  headerComponent,
}: CourseDetailWrapperProps) {
  const isUserEnrolled = user?.enrollments?.some(
    (e: App.Enrollment) => e.courseId === course.id,
  );
  const router = useRouter();

  const [isEnrolled] = useState(isUserEnrolled || false);
  const [activePreviewVideoId, setActivePreviewVideoId] = useState<
    number | null
  >(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!user || !token) {
      toast.error("Please log in to enroll");
      router.push("/auth/login");
      return;
    }

    try {
      setIsEnrolling(true);
      const data = await enrollIntoCourse(token, course.id);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start checkout");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error,
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {isEnrolled ? (
        <>
          <CourseClassroomHeader course={course} user={user} />
          <CoursePlayerView course={course} user={user} token={token} />
        </>
      ) : activePreviewVideoId ? (
        <>
          <header className="bg-zinc-950 text-white p-4 flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-zinc-200 flex items-center gap-2"
              onClick={() => setActivePreviewVideoId(null)}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Course Overview
            </Button>
            <div className="text-sm font-medium">Free Preview Mode</div>
          </header>
          <CoursePlayerView
            course={course}
            initialVideoId={activePreviewVideoId}
            isPreviewMode={true}
            user={user}
            token={token}
          />
        </>
      ) : (
        <>
          <div className="bg-zinc-900 text-white pt-5">{headerComponent}</div>
          <CourseMarketingView
            course={course}
            onPreview={(videoId) => setActivePreviewVideoId(videoId)}
            onEnroll={handleEnroll}
            isEnrolling={isEnrolling}
            user={user}
          />
        </>
      )}
    </div>
  );
}
