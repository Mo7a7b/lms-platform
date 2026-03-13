"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const EditCourseDetails = dynamic(() => import("./EditCourseDetails"), {
  loading: () => (
    <div className="flex h-150 items-center justify-center">
      <Skeleton className="h-full w-full text-muted-foreground" />
    </div>
  ),
  ssr: false,
});
const EditCourseChapters = dynamic(() => import("./EditCourseChapters"), {
  loading: () => (
    <div className="flex h-100 items-center justify-center">
      <Skeleton className="h-full w-full text-muted-foreground" />
    </div>
  ),
  ssr: false,
});
const EditCourseStatus = dynamic(() => import("./EditCourseStatus"), {
  loading: () => (
    <div className="flex h-50 items-center justify-center">
      <Skeleton className="h-full w-full text-muted-foreground" />
    </div>
  ),
  ssr: false,
});

interface EditCourseViewProps {
  course: App.Course;
}

export default function EditCourseView({ course }: EditCourseViewProps) {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Course</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <EditCourseDetails course={course} />
        {/* Right Panel: Chapters & Status */}
        <div className="flex flex-col gap-4">
          {/* Chapters */}
          <EditCourseChapters course={course} />
          {/* Status */}
          <EditCourseStatus course={course} />
        </div>
      </div>
    </div>
  );
}
