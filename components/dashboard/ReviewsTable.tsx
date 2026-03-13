"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Loader2 } from "lucide-react";
import { TablePagination } from "./TablePagination";
import useSWR from "swr";
import { getInstructorReviews } from "@/lib/api/review.api";
import { useAuthData } from "@/hooks/useAuthData";
import { formatDistanceToNow } from "date-fns";
import { Rating } from "@/components/ui/rating";

export default function ReviewsTable() {
  const { token } = useAuthData();
  const pageSize = 5;

  // Fetch reviews
  const { data: reviewsData, isLoading: isReviewsLoading } = useSWR(
    token ? ["/review/instructor", token] : null,
    ([, t]) => getInstructorReviews(t),
  );

  // === State ===
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewSort, setReviewSort] = useState<{
    key: "studentName" | "courseTitle" | "rating" | "createdAt";
    asc: boolean;
  }>({ key: "createdAt", asc: false });

  const [openModal, setOpenModal] = useState(false);
  const [activeReview, setActiveReview] = useState<App.Review | null>(null);

  const filteredReviews = () => {
    if (!reviewsData?.reviews) return [];

    // Flatten/adapt for sorting/filtering if needed, or just use App.Review
    const data = reviewsData?.reviews.filter(
      (r: App.Review) =>
        r.user?.name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.course?.title?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment?.toLowerCase().includes(reviewSearch.toLowerCase()),
    );

    data.sort((a, b) => {
      const getVal = (r: App.Review, k: string) => {
        if (k === "studentName") return r.user?.name || "";
        if (k === "courseTitle") return r.course?.title || "";
        if (k === "rating") return r.rating;
        if (k === "createdAt") return new Date(r.createdAt).getTime();
        return "";
      };

      const valA = getVal(a, reviewSort.key);
      const valB = getVal(b, reviewSort.key);

      if (valA < valB) return reviewSort.asc ? -1 : 1;
      if (valA > valB) return reviewSort.asc ? 1 : -1;
      return 0;
    });
    return data;
  };

  const reviewPages = Math.ceil(filteredReviews().length / pageSize);

  const currentReviews = filteredReviews().slice(
    (reviewPage - 1) * pageSize,
    reviewPage * pageSize,
  );

  const sortHandler = (key: string, type: "review") => {
    if (type === "review")
      setReviewSort((s) => ({
        key: key as any,
        asc: s.key === key ? !s.asc : true,
      }));
  };

  const sortIndicator = (
    currentSort: { key: string; asc: boolean },
    col: string,
  ) => {
    if (currentSort.key !== col) return null;
    return currentSort.asc ? " ▲" : " ▼";
  };

  return (
    <div className="min-h-screen p-6 bg-muted space-y-6">
      <h1 className="text-3xl font-bold">Students Reviews</h1>

      {/* === Reviews Table === */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Search className="text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={reviewSearch}
                onChange={(e) => {
                  setReviewSearch(e.target.value);
                  setReviewPage(1);
                }}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isReviewsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background">
                    {[
                      { key: "studentName", label: "Student" },
                      { key: "courseTitle", label: "Course" },
                      { key: "rating", label: "Rating" },
                      { key: "createdAt", label: "Date" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="p-3 text-sm font-medium border-b cursor-pointer"
                        onClick={() => sortHandler(col.key, "review")}
                      >
                        {col.label}
                        {sortIndicator(reviewSort, col.key)}
                      </th>
                    ))}
                    <th className="p-3 text-sm font-medium border-b">Review</th>
                    <th className="p-3 text-sm font-medium border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="hover:bg-muted/30 transition"
                    >
                      <td className="p-3 border-b font-medium">
                        {review.user?.name}
                      </td>
                      <td className="p-3 border-b">{review.course?.title}</td>
                      <td className="p-3 border-b">
                        <Rating
                          rate={review.rating}
                          showScore={false}
                          className="scale-75 origin-left"
                        />
                      </td>
                      <td className="p-3 border-b text-sm text-muted-foreground">
                        {review.createdAt &&
                          formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                      </td>
                      <td
                        className="p-3 border-b text-muted-foreground max-w-xs truncate"
                        title={review.comment}
                      >
                        {review.comment}
                      </td>
                      <td className="p-3 border-b">
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveReview(review);
                            setOpenModal(true);
                          }}
                        >
                          Respond
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {currentReviews.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end mt-2">
                <TablePagination
                  page={reviewPage}
                  totalPages={reviewPages}
                  setPage={setReviewPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* === Modal === */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>{activeReview?.user?.name}</strong> on{" "}
              <em>{activeReview?.course?.title}</em>:
            </p>
            <div className="flex items-center gap-2">
              <Rating rate={activeReview?.rating || 0} />
            </div>
            <p className="text-muted-foreground p-3 bg-muted rounded-md italic">
              &quot;{activeReview?.comment}&quot;
            </p>
            <Input placeholder="Write your response... (Feature coming soon)" />
            <Button
              onClick={() => {
                alert("Response feature pending implementation");
                setOpenModal(false);
              }}
            >
              Send Response
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
