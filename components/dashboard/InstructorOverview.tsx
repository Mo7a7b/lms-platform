"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  BarChart3,
  BookOpen,
  DollarSign,
  Loader2,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useAnalytics } from "@/lib/queries/useAnalytics";
import { Badge } from "../ui/badge";

export default function InstructorOverview({ token }: { token: string }) {
  const { data, isLoading } = useAnalytics(token);

  const statCards = [
    {
      title: "Total Courses",
      value: isLoading ? null : data.analytics.totalCourses,
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Students",
      value: isLoading ? null : data.analytics.totalStudents,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: isLoading ? null : `$${data.analytics.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24 rounded-md" />
                    ) : (
                      <p className="text-3xl font-bold tracking-tight">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div
                    className={`${stat.bgColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Published Courses Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Published Courses</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track your active courses
              </p>
            </div>
            {!isLoading && data?.analytics?.publishedCourses?.length > 0 && (
              <Badge variant="secondary" className="text-sm font-semibold">
                {data.analytics.publishedCourses.length} Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Loading courses...
                </p>
              </div>
            ) : data.analytics.publishedCourses?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No Published Courses
                </h3>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  Create and publish your first course to start teaching
                  students
                </p>
                <Button asChild>
                  <Link href="/dashboard/courses">Create Course</Link>
                </Button>
              </div>
            ) : (
              data?.analytics?.publishedCourses?.map((course: App.Course) => (
                <Card
                  key={course.id}
                  className="group hover:shadow-lg transition-all duration-300 border overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-5">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Published
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">
                              {course.enrollments?.length || 0}{" "}
                              {course.enrollments?.length === 1
                                ? "student"
                                : "students"}
                            </span>
                          </span>
                          {course.price !== undefined && (
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="font-medium">
                                {course.price === 0
                                  ? "Free"
                                  : `$${course.price.toFixed(2)}`}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="font-semibold shadow-sm"
                        >
                          Manage Course
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
