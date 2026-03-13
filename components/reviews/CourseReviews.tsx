"use client";

import { useState } from "react";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ReviewItem } from "./ReviewItem";
import { ReviewFormDialog } from "./ReviewFormDialog";
import { deleteReview } from "@/lib/api/review.api";
import { useCourseReviews } from "@/lib/queries/useCourseReviews";

interface CourseReviewsProps {
  courseId: number;
  currentUser?: App.authContextType["user"] | null;
  token?: string | null;
  isEnrolled?: boolean;
}

export function CourseReviews({
  courseId,
  currentUser,
  token,
  isEnrolled,
}: CourseReviewsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<App.Review | null>(null);
  const { data, isLoading, mutate } = useCourseReviews(courseId.toString());

  const handleDelete = async (reviewId: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(token, reviewId.toString());
      toast.success("Review deleted");
      mutate();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = (review: App.Review) => {
    setEditingReview(review);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingReview(null);
    setIsDialogOpen(true);
  };

  const userReview = currentUser
    ? data?.reviews.find(
        (r: App.Review) =>
          r.user?.id === currentUser.id || r.userId === currentUser.id,
      )
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Reviews ({data?.reviews.length})
        </h3>
        {isEnrolled && token && !userReview && (
          <Button onClick={handleCreate} size="sm">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : data?.reviews.length === 0 ? (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {data?.reviews.map((review: App.Review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUser={currentUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {token && (
        <ReviewFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          courseId={courseId}
          reviewToEdit={editingReview}
          token={token}
          onSuccess={mutate}
        />
      )}
    </div>
  );
}
