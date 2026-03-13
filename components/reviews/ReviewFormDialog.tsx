"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createReview, updateReview } from "@/lib/api/review.api";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z
    .string()
    .min(3, "Review must be at least 3 characters")
    .max(1000, "Review is too long"),
});

interface ReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId?: number;
  reviewToEdit?: App.Review | null;
  onSuccess: () => void;
  token: string;
}

export function ReviewFormDialog({
  open,
  onOpenChange,
  courseId,
  reviewToEdit,
  onSuccess,
  token,
}: ReviewFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  useEffect(() => {
    if (reviewToEdit) {
      form.reset({
        rating: reviewToEdit.rating,
        comment: reviewToEdit.comment,
      });
    } else {
      form.reset({
        rating: 0,
        comment: "",
      });
    }
  }, [reviewToEdit, form, open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (reviewToEdit) {
        await updateReview(token, {
          reviewId: reviewToEdit.id.toString(),
          rating: values.rating,
          comment: values.comment,
        });
        toast.success("Review updated successfully");
      } else {
        if (!courseId) return;
        await createReview(token, {
          courseId: courseId.toString(),
          rating: values.rating,
          comment: values.comment,
        });
        toast.success("Review submitted successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {reviewToEdit ? "Edit Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with this course. Your feedback helps others!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={cn(
                            "p-1 hover:scale-110 transition-transform focus:outline-none",
                            (hoverRating || field.value) >= star
                              ? "text-yellow-400"
                              : "text-muted-foreground/30",
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={cn(
                              "h-8 w-8",
                              (hoverRating || field.value) >= star
                                ? "fill-current"
                                : "fill-transparent",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you like or dislike about the course?"
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : reviewToEdit
                    ? "Update Review"
                    : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
