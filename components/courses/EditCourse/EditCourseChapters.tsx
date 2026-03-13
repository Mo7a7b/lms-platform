"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const CardContent = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardContent),
);
const CardHeader = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardHeader),
);
const CardTitle = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardTitle),
);
import { toast } from "sonner";
const ChapterList = dynamic(() => import("../Chapters/ChapterList"), {
  loading: () => (
    <div className="flex h-24 items-center justify-center">
      <Skeleton className="h-6 w-full text-muted-foreground" />
    </div>
  ),
  ssr: false,
});
import { Plus, Loader2 } from "lucide-react";
import { createChapter, deleteChapter, reorderChapters } from "@/lib/api";
import { useAuthData } from "@/hooks/useAuthData";
import { Skeleton } from "@/components/ui/skeleton";

function EditCourseChapters({ course }: { course: App.Course }) {
  const { token } = useAuthData();
  const [chapters, setChapters] = useState(course?.chapters || []);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [isReorderingChapters, setIsReorderingChapters] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState(false);
  const [chapterDeleted, setChapterDeleted] = useState<number | null>(null);

  const handleCreateChapter = async () => {
    setIsCreatingChapter(true);
    try {
      const result = await createChapter(
        token,
        Number(course.id),
        chapters.length + 1,
      );
      if (result.message && result.chapter) {
        setChapters([...chapters, result.chapter]);
        toast.success(result.message);
      }
    } catch {
      toast.error("Failed to create chapter");
    } finally {
      setIsCreatingChapter(false);
    }
  };

  const handleReorderChapters = async (newChapters: App.Chapter[]) => {
    try {
      setIsReorderingChapters(true);
      const chaptersOrders: number[] = newChapters.map((c) => {
        return c.id;
      });
      const result = await reorderChapters(
        token,
        course.id.toString(),
        chaptersOrders,
      );
      if (result.message) {
        toast.success(result.message);
        setChapters(result.chapters);
      }
    } catch {
      toast.error("Failed to save chapter order");
    } finally {
      setIsReorderingChapters(false);
    }
  };

  const handleDeleteChapter = async (chapterId: App.Chapter["id"]) => {
    setIsDeletingChapter(true);
    setChapterDeleted(chapterDeleted);
    try {
      const result = await deleteChapter(
        token,
        chapterId.toString(),
        course.id.toString(),
      );
      if (result.message) {
        toast.success(result.message);
        setChapters(chapters.filter((c) => c.id !== chapterId));
      }
    } catch {
      toast.error("Failed to delete chapter");
      setChapterDeleted(null);
    } finally {
      setIsDeletingChapter(false);
    }
  };
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Chapters</CardTitle>
        <Button onClick={handleCreateChapter} disabled={isCreatingChapter}>
          <Plus className="w-4 h-4 mr-2" />
          Add Chapter
        </Button>
      </CardHeader>
      <CardContent>
        {chapters.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No chapters yet. Click &quot;Add Chapter&quot; to create one.
          </div>
        ) : (
          <>
            {isReorderingChapters ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <>
                <ChapterList
                  chapters={chapters}
                  courseId={course.id.toString()}
                  onReorder={handleReorderChapters}
                  onDelete={handleDeleteChapter}
                  isDeleting={isDeletingChapter}
                  chapterDeleted={chapterDeleted as number}
                />
                {isCreatingChapter && (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default EditCourseChapters;
