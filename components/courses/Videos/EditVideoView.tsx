"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateVideo } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const EditVideoView = ({
  chapterId,
  courseId,
  videoId,
  token,
  video,
}: {
  courseId: string;
  chapterId: string;
  videoId: string;
  token: string;
  video: App.Video;
}) => {
  const [title, setTitle] = useState(video.title);
  const [url, setUrl] = useState(video.url);
  const [description, setDescription] = useState(video.description);
  const [isSaving, setIsSaving] = useState(false);
  const [duration, setDuration] = useState(video.duration);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateVideo(
        token,
        Number(videoId),
        title,
        description,
        url,
        Number(duration),
      );
      if (res.message) {
        toast.success(res.message);
      }
    } catch {
      toast.error("Failed to update video");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dashboard/courses/${courseId}/chapters/${chapterId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Video</h1>
          <p className="text-sm text-muted-foreground">
            Course ID: {courseId} • Chapter ID: {chapterId} • Video ID:{" "}
            {videoId}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Details:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {video.provider === "Youtube" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Url</Label>
                  <Input
                    placeholder="https://youtu.be/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Duration</Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Link
                href={`/dashboard/courses/${courseId}/chapters/${chapterId}`}
              >
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVideoView;
