import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { useStudentEnrollments } from "@/lib/queries/useStudentEnrollments";
import { useAuthData } from "@/hooks/useAuthData";
import {
  BookOpen,
  Clock,
  Loader2,
  PlayCircle,
  ArrowRight,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatDuration } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { COURSE_CATEGORIES } from "@/lib/constants";

function StudentOverview() {
  const { token, user } = useAuthData();
  const { data, isLoading } = useStudentEnrollments(token);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const enrollments = data?.enrollments || [];
  const totalCourses = enrollments.length;
  const totalDuration = enrollments.reduce(
    (acc, curr) => acc + curr.course.totalDuration,
    0,
  );
  const totalVideos = enrollments.reduce(
    (acc, curr) => acc + curr.course.totalVideos,
    0,
  );

  // Get unique categories from enrolled courses
  const uniqueCategories = [
    ...new Set(
      enrollments.map((e) =>
        typeof e.course.category === "number"
          ? COURSE_CATEGORIES[e.course.category]
          : e.course.category,
      ),
    ),
  ];

  const dailyQuote = {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  };

  const recentCourses = enrollments.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Learning Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalDuration / 60)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Total content available
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow bg-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideos}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Recent Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Pick up where you left off
            </h2>
            <Link
              href="/dashboard/courses"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentCourses.length > 0 ? (
            <div className="space-y-4">
              {recentCourses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="h-16 w-24 rounded-lg bg-muted relative overflow-hidden flex-shrink-0">
                    <Image
                      src={enrollment.course.poster.url}
                      alt={enrollment.course.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {enrollment.course.title}
                    </h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(enrollment.course.totalDuration)}
                      </span>
                      <span>•</span>
                      <span>{enrollment.course.chapters.length} Chapters</span>
                    </div>
                  </div>
                  <Link href={`/courses/${enrollment.course.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Resume
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t enrolled in any courses yet.
                </p>
                <Link href="/courses">
                  <Button>Browse Catalog</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Motivation & Categories */}
        <div className="space-y-6">
          {/* Daily Quote */}
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Quote className="h-24 w-24 rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-medium text-white/90">
                <Sparkles className="w-4 h-4" /> Daily Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <blockquote className="text-lg font-medium leading-relaxed italic">
                &quot;{dailyQuote.text}&quot;
              </blockquote>
              <footer className="mt-4 text-sm text-white/80 font-medium">
                — {dailyQuote.author}
              </footer>
            </CardContent>
          </Card>

          {/* Your Categories */}
          {uniqueCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {uniqueCategories.map((category) => (
                    <div
                      key={category}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Categories from your enrolled courses
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
export default StudentOverview;
