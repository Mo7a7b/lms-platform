"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewItemProps {
  review: App.Review;
  currentUser?: App.authContextType["user"] | null;
  onEdit?: (review: App.Review) => void;
  onDelete?: (reviewId: number) => void;
}

export function ReviewItem({
  review,
  currentUser,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const isOwner =
    currentUser?.id === review.user?.id || currentUser?.id === review.userId;

  return (
    <div className="flex gap-4 py-8 border-b border-border/50 hover:bg-muted/10 transition-colors px-2 -mx-2 rounded-lg">
      <Avatar className="h-10 w-10 border shadow-sm">
        <AvatarImage
          src={review.user?.profileImg?.url}
          alt={review.user?.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/5 font-medium">
          {review.user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h4 className="font-semibold text-sm text-foreground">
              {review.user?.name || "Unknown User"}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Rating
                rate={review.rating}
                className="[&_svg]:size-3.5 [&>div]:size-3.5"
              />
              <span>•</span>
              <time dateTime={review.createdAt as unknown as string}>
                {review.createdAt &&
                  formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
              </time>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => onEdit(review)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit review</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(review.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete review</span>
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      </div>
    </div>
  );
}
