"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAnalytics } from "@/lib/queries/useAnalytics";
import { useAuthData } from "@/hooks/useAuthData";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
export default function AnalyticsView() {
  const { token, user } = useAuthData();

  if (user.role !== "Instructor") {
    redirect("/dashboard");
  }

  const { data, isLoading } = useAnalytics(token);
  return (
    <div className="p-6 space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Instructor Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Stat title="Students" value={data.analytics.totalStudents} />
            <Stat title="Courses" value={data.analytics.totalCourses} />
            <Stat title="Revenue" value={`$${data.analytics.totalRevenue}`} />
            <Stat
              title="Avg Rating"
              value={data.analytics.avgRating || "N/A"}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Students Per Course</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.analytics.studentsPerCourse}>
                  <XAxis dataKey="course" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </CardContent>
    </Card>
  );
}
