"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../../ui/badge";

interface SortableChapterItemProps {
  id: string;
  chapter: App.Chapter;
  courseId: string;
  onDelete: () => void;
  isDeleting: boolean;
  chapterDeleted: number;
}

function SortableChapterItem({
  id,
  chapter,
  courseId,
  onDelete,
  isDeleting,
  chapterDeleted,
}: SortableChapterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-muted rounded-md mb-2 border hover:bg-muted/80 gap-x-2"
    >
      <div className="flex items-center gap-x-2 flex-1 min-w-0 mr-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab flex-shrink-0"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        {isDeleting && chapterDeleted === chapter.id && (
          <Loader2 className="animate-spin flex-shrink-0" />
        )}

        {chapter.isFreePreview && (
          <Badge variant="default" className="flex-shrink-0">
            Free
          </Badge>
        )}
        <span className="font-medium truncate">{chapter.title}</span>
      </div>
      <div className="flex items-center gap-x-2 flex-shrink-0">
        {chapter?.videos?.length > 0 && (
          <Badge variant="default">
            {chapter?.videos?.length}{" "}
            {chapter?.videos?.length === 1 ? "Video" : "Videos"}
          </Badge>
        )}
        <Link href={`/dashboard/courses/${courseId}/chapters/${chapter.id}`}>
          <Button
            size="icon"
            variant="ghost"
            disabled={isDeleting && chapterDeleted === chapter.id}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          onClick={onDelete}
          size="icon"
          variant="ghost"
          disabled={isDeleting && chapterDeleted === chapter.id}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface ChapterListProps {
  chapters: App.Chapter[];
  courseId: string;
  onReorder: (chapters: App.Chapter[]) => void;
  onDelete: (chapterId: App.Chapter["id"]) => void;
  isDeleting: boolean;
  chapterDeleted: number;
}

export default function ChapterList({
  chapters,
  courseId,
  onReorder,
  onDelete,
  isDeleting,
  chapterDeleted,
}: ChapterListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = chapters.findIndex((item) => item.id === active.id);
      const newIndex = chapters.findIndex((item) => item.id === over?.id);

      const newChapters = arrayMove(chapters, oldIndex, newIndex);
      onReorder(newChapters);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={chapters.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-4">
          {chapters.map((chapter) => (
            <SortableChapterItem
              key={chapter.id}
              id={chapter.id.toString()}
              chapter={chapter}
              courseId={courseId}
              onDelete={() => onDelete(chapter.id)}
              isDeleting={isDeleting}
              chapterDeleted={chapterDeleted}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
