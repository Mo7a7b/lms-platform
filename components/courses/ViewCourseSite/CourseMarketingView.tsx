"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  FileText,
  Lock,
  PlayCircle,
  Star,
} from "lucide-react";
import { cn, formatDate, formatDuration, formatPrice } from "@/lib/utils";
import { useCourseReviews } from "@/lib/queries/useCourseReviews";
import { ReviewItem } from "../../reviews/ReviewItem";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";
import { Skeleton } from "../../ui/skeleton";

const COURSE_CATEGORIES = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Health",
  "Productivity",
  "Languages",
  "Mathematics",
  "Science",
  "Engineering",
  "Electronics",
  "Cooking",
  "Music",
  "Writing",
  "History",
  "Law",
];

interface CourseMarketingViewProps {
  course: App.Course;
  onPreview?: (videoId: number) => void;
  onEnroll?: () => void;
  isEnrolling?: boolean;
  user?: App.authContextType["user"] | null;
}

export function CourseMarketingView({
  course,
  onPreview,
  onEnroll,
  isEnrolling = false,
  user,
}: CourseMarketingViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-zinc-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary-foreground hover:bg-primary/30"
                >
                  {typeof course.category === "number"
                    ? COURSE_CATEGORIES[course.category]
                    : course.category}
                </Badge>
                {course.reviews && course.reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">
                      {(
                        course.reviews.reduce(
                          (acc: number, r: App.Review) => acc + r.rating,
                          0,
                        ) / course.reviews.length
                      ).toFixed(1)}
                    </span>
                    <span className="text-zinc-400 text-sm">
                      ({course.reviews.length} ratings)
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-zinc-300 max-w-2xl">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    {formatDuration(course.totalDuration)} Total Duration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>{course.chapters.length} Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Last updated: {formatDate(course.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You Will Learn */}
            <section className="border rounded-xl p-6 md:p-8 bg-card/50">
              <h2 className="text-2xl font-bold mb-6">
                What you&apos;ll learn
              </h2>
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">
                        <svg
                          className="h-4 w-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No specific learning outcomes listed for this course.
                </p>
              )}
            </section>

            {/* Course Content */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="border rounded-lg overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  {course.chapters.map((chapter) => (
                    <AccordionItem
                      key={chapter.id}
                      value={`chapter-${chapter.id}`}
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-left w-full">
                          <span className="font-medium text-base break-words">
                            {chapter.title}
                          </span>
                          <span className="text-xs text-muted-foreground font-normal sm:whitespace-nowrap hidden sm:inline-block">
                            • {chapter.videos.length} lectures
                          </span>
                          <span className="text-xs text-muted-foreground font-normal sm:hidden">
                            {chapter.videos.length} lectures
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-muted/20">
                        <div className="flex flex-col">
                          {chapter.videos.map((video) => (
                            <div
                              key={video.id}
                              className={cn(
                                "flex items-center justify-between px-6 py-3 border-b last:border-0",
                                chapter.isFreePreview
                                  ? "hover:bg-primary/5 cursor-pointer"
                                  : "hover:bg-muted/50 cursor-default",
                              )}
                              onClick={() => {
                                if (chapter.isFreePreview && onPreview) {
                                  onPreview(video.id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle
                                  className={cn(
                                    "w-4 h-4",
                                    chapter.isFreePreview
                                      ? "text-primary"
                                      : "text-muted-foreground",
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-sm",
                                    chapter.isFreePreview &&
                                      "text-primary font-medium",
                                  )}
                                >
                                  {video.title}
                                </span>
                              </div>
                              {chapter.isFreePreview ? (
                                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                                  Preview
                                </span>
                              ) : (
                                <Lock className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Requirements</h2>
              {course.requirements && course.requirements.length > 0 ? (
                <ul className="space-y-4">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">
                  No specific requirements or prerequisites for this course.
                </p>
              )}
            </section>
          </div>

          {/* Right Sidebar - Desktop Only Sticky / Mobile Normal Order */}
          <div className="relative lg:col-span-1 lg:-mt-[400px] z-10">
            <div className="sticky top-24 space-y-6">
              <Card className="overflow-hidden shadow-lg border-primary/10 p-0 gap-0">
                <div className="relative aspect-video w-full">
                  <Image
                    src={course.poster.url}
                    alt={course.title}
                    fill
                    className="object-cover object-top border-b"
                  />
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(course.price.toString())}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full text-lg font-semibold"
                    onClick={onEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? "Processing..." : "Enroll Now"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    30-Day Money-Back Guarantee
                  </p>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">
                      This course includes:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4" />
                        <span>{course.totalVideos} video lessons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Full lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Access on mobile and TV</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50 flex items-center justify-between shadow-2xl pb-safe">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-medium">
            Price
          </span>
          <span className="text-xl font-bold">
            {formatPrice(course.price.toString())}
          </span>
        </div>
        <Button
          size="lg"
          className="w-1/2 font-bold"
          onClick={onEnroll}
          disabled={isEnrolling}
        >
          {isEnrolling ? "Processing..." : "Enroll Now"}
        </Button>
      </div>

      <div className="container px-6 py-12">
        <ReviewsSection courseId={course.id} user={user} />
      </div>
    </div>
  );
}

function ReviewsSection({
  courseId,
  user,
}: {
  courseId: number;
  user?: App.authContextType["user"] | null;
}) {
  const { data, isLoading } = useCourseReviews(courseId.toString());
  const reviews = useMemo(() => data?.reviews || [], [data?.reviews]);

  const stats = useMemo(() => {
    if (!reviews.length)
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

    const total = reviews.length;
    const sum = reviews.reduce(
      (acc: number, r: App.Review) => acc + r.rating,
      0,
    );
    const average = sum / total;

    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r: App.Review) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[5 - r.rating]++; // Index 0 is 5 stars, Index 4 is 1 star
      }
    });

    return { average, total, distribution };
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-12">
        <Skeleton className="w-[80%] h-50" />
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-8">Student Feedback</h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
        {/* Rating Overview */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-muted/30 rounded-xl border">
          <div className="text-5xl font-bold text-primary mb-2">
            {stats.average.toFixed(1)}
          </div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-5 h-5",
                  star <= Math.round(stats.average)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Course Rating
          </div>
        </div>

        {/* Rating Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => {
            const count = stats.distribution[index] || 0;
            const percentage =
              stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 min-w-[3rem] font-medium">
                  <span>{rating}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 ml-1" />
                </div>
                <Progress value={percentage} className="h-2.5 flex-1" />
                <div className="min-w-[3rem] text-right text-muted-foreground">
                  {Math.round(percentage)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground italic">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review: App.Review) => (
              <ReviewItem key={review.id} review={review} currentUser={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
