"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { editCourse } from "@/lib/actions/updateCourse";
import { ShieldAlert, Gem } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useAuthData } from "@/hooks/useAuthData";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { ArrayInput } from "@/components/ui/arrayInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CourseFormData {
  title: string;
  description: string;
  poster: string;
  price: number;
  category: string;
  requirements: string;
  whatYouWillLearn: string;
}

function EditCourseDetails({ course }: { course: App.Course }) {
  const { token } = useAuthData();
  const router = useRouter();
  const commaStringToArray = z.preprocess((val) => {
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return val;
  }, z.array(z.string()).min(1));

  const courseDetailsSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(5).max(1000),
    poster: z.string().url(),
    category: z.enum(COURSE_CATEGORIES),
    requirements: commaStringToArray,
    whatYouWillLearn: commaStringToArray,
    price: z.number().min(0),
  });

  const initialState: App.FormState = {
    message: "",
    data: null,
  };
  const [state, formAction, isPending] = useActionState(
    editCourse,
    initialState,
  );

  const initialCategory =
    typeof course.category === "number"
      ? COURSE_CATEGORIES[course.category]
      : course.category;

  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseDetailsSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      title: course.title,
      description: course.description,
      poster: course.poster.url || "",
      price: course.price,
      category: initialCategory || "",
      requirements: course.requirements.join(",") || "",
      whatYouWillLearn: course.whatYouWillLearn.join(",") || "",
    },
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/courses");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const category = watch("category");
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="poster">Poster Image URL</Label>
            <Input
              id="poster"
              {...register("poster", {
                required: "Poster URL is required",
              })}
            />
            {errors.poster && (
              <p className="text-sm text-red-500">{errors.poster.message}</p>
            )}
            {course.poster && (
              <div className="relative w-full h-40 mt-2 rounded-md overflow-hidden border">
                <Image
                  src={course.poster.url}
                  alt="Course poster preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(val) => {
                setValue("category", val);
              }}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="hidden" name="category" value={category} />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* What You Will Learn */}
          <ArrayInput
            defaultArray={course.whatYouWillLearn || []}
            options={{
              name: "whatYouWillLearn",
              minLength: 10,
              maxLength: 100,
              icon: <Gem className="w-4 h-4" />,
            }}
            {...register("whatYouWillLearn")}
          />
          {/* Requirements */}
          <ArrayInput
            defaultArray={course.requirements || []}
            options={{
              name: "requirements",
              minLength: 10,
              maxLength: 100,
              icon: <ShieldAlert className="w-4 h-4" />,
            }}
            {...register("requirements")}
          />

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
            />
          </div>
          <Input type="hidden" name="token" value={token} />
          <Input type="hidden" name="courseId" value={course.id.toString()} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !isValid}
          >
            {isPending ? "Saving..." : "Save Course Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditCourseDetails;
