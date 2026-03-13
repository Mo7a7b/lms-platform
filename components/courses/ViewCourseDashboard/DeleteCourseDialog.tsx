import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { deleteCourse } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

const DeleteCourseDialog = ({
  token,
  course,
  courses,
  setCourses,
  setIsDeleting,
  isDeleting,
  setDeletedCourse,
  deletedCourse,
}: {
  token: string;
  course: App.Course;
  courses: App.Course[];
  setCourses: React.Dispatch<React.SetStateAction<App.Course[]>>;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedCourse: React.Dispatch<React.SetStateAction<number | null>>;
  deletedCourse: number | null;
  isDeleting: boolean;
}) => {
  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    setDeletedCourse(Number(course.id));
    try {
      const res = await deleteCourse(token, course.id.toString());
      if (res.message) {
        toast.success(res.message);
        const updatedCourses = courses.filter(
          (c) => c.id !== Number(course.id),
        );
        setCourses(updatedCourses);
      }
    } catch (err) {
      toast.error(
        (err as { response: { data: { error: string } } }).response.data.error,
      );
    } finally {
      setIsDeleting(false);
      setDeletedCourse(null);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isDeleting && deletedCourse === course.id}
          size="sm"
          variant="destructive"
        >
          {isDeleting && deletedCourse === course.id ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            course including all its content (chapters, videos, etc.) from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDeleteCourse}>
            {isDeleting && <Loader2 className="animate-spin" />}
            {isDeleting ? "Deleting Course..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCourseDialog;
