"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentEnrollments } from "@/lib/queries/useStudentEnrollments";
import { useAuthData } from "@/hooks/useAuthData";
import { BookOpen, Clock, Loader2, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { ViewSwitcher, ViewType } from "../ViewCourseDashboard/ViewSwitcher";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentCourses = () => {
  const { token } = useAuthData();
  const { data, isLoading } = useStudentEnrollments(token);
  const [view, setView] = useState<ViewType>("card");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (data?.enrollments?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <div className="bg-muted p-6 rounded-full">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No courses found</h3>
        <p className="text-muted-foreground max-w-sm">
          You haven&apos;t enrolled in any courses yet. browse our catalog to
          get started.
        </p>
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  const enrollments = data?.enrollments || [];

  return (
    <div className="space-y-6">
      {/* Header with View Switcher */}
      <div className="flex items-center justify-end">
        <ViewSwitcher view={view} onViewChange={setView} />
      </div>

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.map((e: App.Enrollment) => (
            <Card
              key={e.id}
              className="group relative overflow-hidden rounded-2xl border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 p-0 gap-0"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={e.course.poster.url}
                  alt={e.course.title}
                  fill
                  className="object-cover border border-1 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-md hover:bg-background/100 shadow-sm">
                    {typeof e.course.category === "number"
                      ? COURSE_CATEGORIES[e.course.category]
                      : e.course.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-bold leading-tight tracking-tight text-foreground line-clamp-2">
                  {e.course.title}
                </h3>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary/80" />
                    <span className="font-medium">
                      {formatDuration(e.course.totalDuration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PlayCircle className="h-4 w-4 text-primary/80" />
                    <span className="font-medium">
                      {e.course.totalVideos} Videos
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Link href={`/courses/${e.course.id}`} className="w-full">
                  <Button className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    Continue Learning
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-3">
          {enrollments.map((e: App.Enrollment) => (
            <Card
              key={e.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-6 p-5">
                  <div className="relative h-24 w-40 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={e.course.poster.url}
                      alt={e.course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                        {e.course.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {typeof e.course.category === "number"
                          ? COURSE_CATEGORIES[e.course.category]
                          : e.course.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary/70" />
                        <span className="font-medium">
                          {formatDuration(e.course.totalDuration)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <PlayCircle className="h-4 w-4 text-primary/70" />
                        <span className="font-medium">
                          {e.course.totalVideos} Videos
                        </span>
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/courses/${e.course.id}`}
                    className="flex-shrink-0"
                  >
                    <Button className="gap-2 h-10 px-6 font-semibold shadow-sm">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[120px] font-semibold">
                  Preview
                </TableHead>
                <TableHead className="font-semibold">Course</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold text-center">
                  Videos
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((e: App.Enrollment) => (
                <TableRow
                  key={e.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="relative h-16 w-28 rounded-md overflow-hidden shadow-sm">
                      <Image
                        src={e.course.poster.url}
                        alt={e.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-base group-hover:text-primary transition-colors">
                    {e.course.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {typeof e.course.category === "number"
                        ? COURSE_CATEGORIES[e.course.category]
                        : e.course.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {formatDuration(e.course.totalDuration)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
                      <PlayCircle className="h-4 w-4 text-primary/70" />
                      {e.course.totalVideos}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/courses/${e.course.id}`}>
                      <Button
                        size="sm"
                        variant="default"
                        className="font-semibold shadow-sm"
                      >
                        Open Course
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
