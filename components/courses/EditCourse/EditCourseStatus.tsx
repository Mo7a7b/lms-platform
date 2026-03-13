"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { changeCourseStatus } from "@/lib/api";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useAuthData } from "@/hooks/useAuthData";

function EditCourseStatus({ course }: { course: App.Course }) {
  const { token } = useAuthData();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [courseStatus, setCourseStatus] = useState<App.Course["status"]>(
    course.status,
  );

  const handleStatusChange = async (status: "Published" | "Archived") => {
    try {
      setIsUpdatingStatus(true);
      const result = await changeCourseStatus(
        token,
        course.id.toString(),
        status,
      );
      if (result.message) {
        toast.success(result.message);
        setCourseStatus(result.course.status as App.Course["status"]);
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error(
        (err as { response: { data: { error: string } } })?.response?.data
          ?.error,
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Status</CardTitle>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            courseStatus === "Published"
              ? "bg-green-100 text-green-800"
              : courseStatus === "Draft"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {courseStatus}
        </span>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="status">Status</Label>
          <Select
            disabled={isUpdatingStatus}
            value={courseStatus}
            onValueChange={(value) =>
              handleStatusChange(value as "Published" | "Archived")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="Draft">
                Draft
              </SelectItem>
              <SelectItem
                disabled={courseStatus === "Published"}
                value="Published"
              >
                Published
              </SelectItem>
              <SelectItem
                disabled={
                  courseStatus === "Archived" || courseStatus === "Draft"
                }
                value="Archived"
              >
                Archived
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default EditCourseStatus;
