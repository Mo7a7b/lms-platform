"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Plus,
  DollarSign,
  FileText,
  ShieldAlert,
  Gem,
  ImagePlus,
} from "lucide-react";
import Image from "next/image";
import { useCreateCourse } from "@/lib/mutations/CreateCourseMutation";
import { useAuthData } from "@/hooks/useAuthData";

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

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CourseFormData {
  title: string;
  description: string;
  poster: string;
  price: number;
  category: string;
}

export function AddCourseModal({ open, onOpenChange }: AddCourseModalProps) {
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [currentWhatYouWillLearn, setCurrentWhatYouWillLearn] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const { token } = useAuthData();
  const { trigger, isMutating } = useCreateCourse(token);

  const {
    register,
    formState: { errors, isValid },
    reset,
    control,
    setValue,
    handleSubmit,
  } = useForm<CourseFormData>({
    defaultValues: {
      title: "",
      description: "",
      poster: "",
      price: 0,
      category: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      await trigger({
        token,
        courseData: {
          title: data.title,
          description: data.description,
          poster: data.poster,
          price: Number(data.price),
          whatYouWillLearn: whatYouWillLearn,
          requirements: requirements,
          category: data.category as unknown as App.CourseCategory,
        },
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  const posterUrl = useWatch({ control, name: "poster" });
  const category = useWatch({ control, name: "category" });

  const addRequirement = () => {
    const trimmedRequirement = currentRequirement.trim();
    if (trimmedRequirement && !requirements.includes(trimmedRequirement)) {
      if (trimmedRequirement.length >= 2 && trimmedRequirement.length <= 50) {
        setRequirements([...requirements, trimmedRequirement]);
        setCurrentRequirement("");
      }
    }
  };

  const removeRequirement = (requirementToRemove: string) => {
    setRequirements(
      requirements.filter((requirement) => requirement !== requirementToRemove),
    );
  };

  const addWhatYouWillLearn = () => {
    const trimmedWhatYouWillLearn = currentWhatYouWillLearn.trim();
    if (
      trimmedWhatYouWillLearn &&
      !whatYouWillLearn.includes(trimmedWhatYouWillLearn)
    ) {
      if (
        trimmedWhatYouWillLearn.length >= 2 &&
        trimmedWhatYouWillLearn.length <= 50
      ) {
        setWhatYouWillLearn([...whatYouWillLearn, trimmedWhatYouWillLearn]);
        setCurrentWhatYouWillLearn("");
      }
    }
  };

  const removeWhatYouWillLearn = (whatYouWillLearnToRemove: string) => {
    setWhatYouWillLearn(
      whatYouWillLearn.filter(
        (whatYouWillLearn) => whatYouWillLearn !== whatYouWillLearnToRemove,
      ),
    );
  };

  const handleClose = () => {
    reset();
    setRequirements([]);
    setWhatYouWillLearn([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create New Course
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new course. All fields are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Course Title
            </Label>
            <Input
              placeholder="Enter course title (5-100 characters)"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title must not exceed 100 characters",
                },
              })}
              className={errors.title ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.title && (
                <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                  {errors.title.message}
                </p>
              )}
              {!errors.title && title.length < 5 && title.length > 0 && (
                <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                  Title must be at least 5 characters
                </p>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {title?.length || 0}/100
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Course Description
            </Label>
            <Textarea
              placeholder="Enter course description (5-1000 characters)"
              rows={5}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description must not exceed 1000 characters",
                },
              })}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.description && (
                <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                  {errors.description.message}
                </p>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {description?.length || 0}/1000
              </span>
            </div>
          </div>

          {/* Poster URL Field */}
          <div className="space-y-2">
            <Label htmlFor="poster" className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4" />
              Poster Image URL
            </Label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("poster", {
                required: "Poster URL is required",
                pattern: {
                  value: /^https?:\/\/.+\..+/,
                  message: "Please enter a valid URL",
                },
              })}
              className={errors.poster ? "border-destructive" : ""}
            />
            {errors.poster && (
              <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                {errors.poster.message}
              </p>
            )}
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border flex items-center justify-center mt-2">
              {posterUrl && !errors.poster ? (
                <Image
                  src={posterUrl}
                  alt="Poster preview"
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                  quality={100}
                />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span className="text-xs">Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="category" className="flex items-center gap-2">
              Category
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("category", value, { shouldValidate: true });
              }}
              value={category}
            >
              <SelectTrigger
                className={`w-full ${errors.category ? "border-destructive" : ""}`}
              >
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
            <Input
              type="hidden"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price (USD)
            </Label>
            <Input
              type="number"
              step="1"
              min="0"
              placeholder="0.00"
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be 0 or greater",
                },
                valueAsNumber: true,
              })}
              className={errors.price ? "border-destructive" : ""}
            />
            {errors.price && (
              <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* What You Will Learn */}
          <div className="space-y-2">
            <Label
              htmlFor="whatYouWillLearn"
              className="flex items-center gap-2"
            >
              <Gem className="w-4 h-4" />
              What You Will Learn
            </Label>
            <div className="flex gap-2">
              <Input
                id="whatYouWillLearn"
                placeholder="Add objectives (10-100 characters)"
                value={currentWhatYouWillLearn}
                onChange={(e) => setCurrentWhatYouWillLearn(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addWhatYouWillLearn();
                  }
                }}
                className={
                  whatYouWillLearn.length === 0 ? "border-destructive" : ""
                }
              />
              <Button
                type="button"
                onClick={addWhatYouWillLearn}
                variant="outline"
                size="icon"
                disabled={
                  !currentWhatYouWillLearn.trim() ||
                  currentWhatYouWillLearn.length < 10 ||
                  currentWhatYouWillLearn.length > 100
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {whatYouWillLearn.length === 0 && (
              <p className="text-sm text-destructive">
                At least one learning objective is required.
              </p>
            )}
            {whatYouWillLearn.length > 0 && (
              <div className="flex flex-col flex-wrap gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
                {whatYouWillLearn.map((w) => (
                  <div
                    key={w}
                    className="inline-flex w-full items-center justify-between gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded truncate text-sm font-medium border border-primary/20 animate-in fade-in-0 zoom-in-95"
                  >
                    {w}
                    <button
                      type="button"
                      onClick={() => removeWhatYouWillLearn(w)}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Input
            name="whatYouWillLearn"
            type="hidden"
            value={whatYouWillLearn.join(",")}
          />
          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Requirements
            </Label>
            <div className="flex gap-2">
              <Input
                id="requirements"
                placeholder="Add requirements (10-100 characters)"
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
                className={
                  requirements.length === 0 ? "border-destructive" : ""
                }
              />
              <Button
                type="button"
                onClick={addRequirement}
                variant="outline"
                size="icon"
                disabled={
                  !currentRequirement.trim() ||
                  currentRequirement.length < 10 ||
                  currentRequirement.length > 100
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {requirements.length === 0 && (
              <p className="text-sm text-destructive">
                At least one requirement is required.
              </p>
            )}
            {requirements.map((r) => (
              <div
                key={r}
                className="inline-flex w-full items-center justify-between gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded truncate text-sm font-medium border border-primary/20 animate-in fade-in-0 zoom-in-95"
              >
                {r}
                <button
                  type="button"
                  onClick={() => removeRequirement(r)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <Input
            name="requirements"
            type="hidden"
            value={requirements.join(",")}
          />

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !isValid ||
                isMutating ||
                requirements.length === 0 ||
                whatYouWillLearn.length === 0
              }
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isMutating ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
