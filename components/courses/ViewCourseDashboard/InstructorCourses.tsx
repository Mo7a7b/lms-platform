"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
const DeleteCourseDialog = dynamic(
  () => import("../ViewCourseDashboard/DeleteCourseDialog"),
  {
    ssr: false,
  },
);
import { useInstructorCourses } from "@/lib/queries/useInstructorCourses";
import { Loader2, Users, DollarSign } from "lucide-react";
import { useAuthData } from "@/hooks/useAuthData";
import { ViewSwitcher, ViewType } from "../ViewCourseDashboard/ViewSwitcher";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InstructorCourses = () => {
  const { token } = useAuthData();
  const { data, isLoading } = useInstructorCourses(token);
  const [courses, setCourses] = useState(data?.courses || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedCourse, setDeletedCourse] = useState<number | null>(null);
  const [view, setView] = useState<ViewType>("list");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCourses(data?.courses || []);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading courses...
        </p>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200";
    }
  };

  const canDelete = (course: App.Course) => {
    return (
      course.status === "Draft" ||
      ((course.status === "Published" || course.status === "Archived") &&
        course?.enrollments?.length === 0) ||
      ((course.status === "Published" || course.status === "Archived") &&
        course.price === 0)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with View Switcher */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <ViewSwitcher view={view} onViewChange={setView} />
      </div>

      {courses.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No courses yet</h3>
            <p className="text-muted-foreground">
              Create your first course to get started!
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Card View */}
          {view === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: App.Course) => (
                <Card
                  key={course.id}
                  className="group relative overflow-hidden rounded-2xl border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 p-0 pb-5 gap-0"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {course.poster?.url ? (
                      <>
                        <Image
                          src={course.poster.url}
                          alt={course.title}
                          fill
                          className="object-cover border border-1 transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className={getStatusBadgeClass(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{course?.enrollments?.length || 0} Students</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-green-600">
                        <DollarSign className="h-4 w-4" />
                        {course.price === 0 ? (
                          <span>Free</span>
                        ) : (
                          <span>{formatPrice(course.price.toString())}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="flex-1"
                      >
                        <Button
                          disabled={isDeleting && deletedCourse === course.id}
                          size="sm"
                          className="w-full"
                        >
                          Edit
                        </Button>
                      </Link>
                      {canDelete(course) && (
                        <DeleteCourseDialog
                          token={token}
                          course={course}
                          courses={courses}
                          setCourses={setCourses}
                          setIsDeleting={setIsDeleting}
                          setDeletedCourse={setDeletedCourse}
                          deletedCourse={deletedCourse}
                          isDeleting={isDeleting}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="space-y-3">
              {courses.map((course: App.Course) => (
                <Card
                  key={course.id}
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center gap-6 p-5">
                      <div className="relative h-24 w-40 rounded-lg overflow-hidden flex-shrink-0 bg-muted shadow-md">
                        {course.poster?.url ? (
                          <Image
                            src={course.poster.url}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <Badge className={getStatusBadgeClass(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary/70" />
                            <span className="font-medium">
                              {course?.enrollments?.length || 0} Students
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            {course.price === 0
                              ? "Free"
                              : formatPrice(course.price.toString())}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {canDelete(course) && (
                          <DeleteCourseDialog
                            token={token}
                            course={course}
                            courses={courses}
                            setCourses={setCourses}
                            setIsDeleting={setIsDeleting}
                            setDeletedCourse={setDeletedCourse}
                            deletedCourse={deletedCourse}
                            isDeleting={isDeleting}
                          />
                        )}
                        <Link href={`/dashboard/courses/${course.id}`}>
                          <Button
                            disabled={isDeleting && deletedCourse === course.id}
                            size="sm"
                            className="font-semibold shadow-sm"
                          >
                            Edit Course
                          </Button>
                        </Link>
                      </div>
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
                    <TableHead className="font-semibold">
                      Course Title
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">
                      Students
                    </TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: App.Course) => (
                    <TableRow
                      key={course.id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="relative h-16 w-28 rounded-md overflow-hidden bg-muted shadow-sm">
                          {course.poster?.url ? (
                            <Image
                              src={course.poster.url}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-base group-hover:text-primary transition-colors">
                        {course.title}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(course.status)}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                          <Users className="h-4 w-4 text-primary/70" />
                          {course?.enrollments?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {course.price === 0 ? (
                          <span className="text-green-600 font-semibold">
                            Free
                          </span>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            {formatPrice(course.price.toString())}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/dashboard/courses/${course.id}`}>
                            <Button
                              disabled={
                                isDeleting && deletedCourse === course.id
                              }
                              size="sm"
                              variant="default"
                              className="font-semibold shadow-sm"
                            >
                              Edit
                            </Button>
                          </Link>
                          {canDelete(course) && (
                            <DeleteCourseDialog
                              token={token}
                              course={course}
                              courses={courses}
                              setCourses={setCourses}
                              setIsDeleting={setIsDeleting}
                              setDeletedCourse={setDeletedCourse}
                              deletedCourse={deletedCourse}
                              isDeleting={isDeleting}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstructorCourses;
