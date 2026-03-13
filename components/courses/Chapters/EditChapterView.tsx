"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

import {
  updateChapter,
  reorderVideos,
  uploadVideoToDB,
  deleteVideo,
} from "@/lib/api";
import VideoList from "../Videos/VideoList";
import type { CheckedState } from "@radix-ui/react-checkbox";
import CloudinaryUploader from "../CloudinaryUploader";

export default function EditChapterView({
  courseId,
  chapterId,
  course,
  chapter,
  token,
}: {
  courseId: string;
  chapterId: string;
  course: App.Course;
  chapter: App.Chapter;
  token: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(chapter.title);
  const [videos, setVideos] = useState<App.Video[]>(chapter.videos ?? []);
  const [isFreePreview, setIsFreePreview] = useState(chapter.isFreePreview);

  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDisc, setVideoDisc] = useState("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  async function handleAddVideoUrl() {
    if (!videoUrl) return;
    setIsAddingVideo(true);
    try {
      if (videoUrl.includes("youtu.be")) {
        const res = await uploadVideoToDB(token, Number(chapterId), {
          title: videoTitle,
          url: videoUrl,
          provider: "Youtube",
          publicId: "external_url",
          duration: videoDuration,
          description: videoDisc,
        });
        setVideos((prev) => [...prev, res.video]);
        toast.success("Video added successfully");
        setVideoUrl("");
        setVideoTitle("");
        setVideoDisc("");
        setVideoDuration(0);
      }
    } catch {
      toast.error("Failed to add video");
    } finally {
      setIsAddingVideo(false);
    }
  }

  async function handleReorderVideos(newVideos: App.Video[]) {
    setIsReordering(true);
    try {
      const ids = newVideos.map((v) => v.id);
      const res = await reorderVideos(token, Number(chapterId), ids);
      if (res.message) {
        setVideos(res.videos);
        toast.success("Videos reordered");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to reorder videos");
    } finally {
      setIsReordering(false);
    }
  }

  async function handleDeleteVideo(videoId: number) {
    setIsDeleting(true);
    try {
      const res = await deleteVideo(token, videoId);
      if (res.message) {
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
        toast.success("Video deleted successfully");
      }
    } catch {
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateChapter(token, chapterId, courseId, title, isFreePreview);
      toast.success("Chapter updated");
    } catch {
      toast.error("Failed to update chapter");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dashboard/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Chapter</h1>
          <p className="text-sm text-muted-foreground">
            Course ID: {courseId} • Chapter ID: {chapterId}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Details:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <FieldLabel>
                <Field orientation="horizontal">
                  <Checkbox
                    disabled={course.price === 0}
                    checked={isFreePreview}
                    onCheckedChange={(checked: CheckedState) => {
                      setIsFreePreview(checked as boolean);
                    }}
                    id="toggle-checkbox-2"
                    name="isFreePreview"
                  />
                  <FieldContent>
                    <FieldTitle>Free Preview</FieldTitle>
                    <FieldDescription>
                      Allow students to preview this chapter for free.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="font-semibold">Videos</h2>

            <div className="bg-muted p-2 rounded-md">
              {isReordering ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin" />
                  <p>Reordering...</p>
                </div>
              ) : isDeleting ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin" />
                  <p>Deleting...</p>
                </div>
              ) : videos.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No videos yet
                </p>
              ) : (
                <VideoList
                  videos={videos}
                  onDelete={handleDeleteVideo}
                  onReorder={handleReorderVideos}
                  courseId={courseId}
                  chapterId={chapterId}
                />
              )}
            </div>
            <h2 className="font-semibold">Add Videos</h2>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger disabled={isAddingVideo} value="upload">
                  Upload Video
                </TabsTrigger>
                <TabsTrigger disabled={isAddingVideo} value="url">
                  Youtube Video (Unlisted)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-4 pt-4">
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">
                  <p>• Video titles will default to their file names.</p>
                  <p>
                    • Descriptions will be empty by default and can be modified
                    using the edit button above.
                  </p>
                  <p>
                    • Please ensure your device remains active and connected
                    during the upload process.
                  </p>
                  <p>• You may upload a maximum of 10 videos at a time.</p>
                </div>
                <CloudinaryUploader
                  chapterId={Number(chapterId)}
                  token={token}
                  setIsAddingVideo={setIsAddingVideo}
                  onUploadSuccess={(video) =>
                    setVideos((prev) => [...prev, video])
                  }
                />
              </TabsContent>
              <TabsContent value="url" className="space-y-4 pt-4">
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">
                  <p>• Only valid YouTube video URLs are supported.</p>
                  <p>
                    • Use the shortened URL format (https://youtu.be/...)
                    available via the YouTube &quot;Share&quot; button.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Video Title</Label>
                  <Input
                    placeholder="Introduction to the course..."
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    placeholder="https://youtu.be/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video Description</Label>
                  <Input
                    placeholder="Description..."
                    value={videoDisc}
                    onChange={(e) => setVideoDisc(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video Duration (in minutes)</Label>
                  <Input
                    placeholder="Duration..."
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                  />
                </div>

                <Button
                  onClick={handleAddVideoUrl}
                  disabled={
                    !videoUrl ||
                    isAddingVideo ||
                    !videoDuration ||
                    !videoTitle ||
                    videoDuration === 0 ||
                    !videoUrl.includes("https://youtu.be")
                  }
                  type="button"
                >
                  {isAddingVideo ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Video
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
