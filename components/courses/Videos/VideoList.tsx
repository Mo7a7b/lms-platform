"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

function SortableVideoItem({
  id,
  video,
  onDelete,
  chapterId,
  courseId,
}: {
  id: string;
  video: App.Video;
  onDelete: () => void;
  chapterId: string;
  courseId: string;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const url = (() => {
    try {
      return JSON.parse(video.url).url;
    } catch {
      return "#";
    }
  })();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-background border rounded-md mb-2"
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-4 h-4" />
        </div>
        <Video className="w-4 h-4 text-blue-500" />
        <Link href={url} target="_blank" className="text-sm hover:underline">
          {video.title || "Untitled"}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/courses/${courseId}/chapters/${chapterId}/videos/${video.id}`}
        >
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function VideoList({
  videos,
  onReorder,
  onDelete,
  chapterId,
  courseId,
}: {
  videos: App.Video[];
  onReorder: (videos: App.Video[]) => void;
  onDelete: (videoId: number) => void;
  chapterId: string;
  courseId: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = videos.findIndex((v) => v.id.toString() === active.id);
    const newIndex = videos.findIndex((v) => v.id.toString() === over.id);

    onReorder(arrayMove(videos, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={videos.map((v) => v.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        {videos.map((video) => (
          <SortableVideoItem
            key={video.id}
            id={video.id.toString()}
            video={video}
            onDelete={() => onDelete(video.id)}
            chapterId={chapterId}
            courseId={courseId}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
