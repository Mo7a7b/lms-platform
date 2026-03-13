"use server";
import { cookies } from "next/headers";
import { CreateCourse } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createCourseAction(
  _: App.FormState,
  formData: FormData,
): Promise<App.FormState> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please log in again.",
      };
    }

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      poster: formData.get("poster") as string,
      price: Number(formData.get("price")),
      category: formData.get("category") as unknown as App.CourseCategory,
      requirements: (formData.get("requirements") as string).split(","),
      whatYouWillLearn: (formData.get("whatYouWillLearn") as string).split(","),
    };

    const response = await CreateCourse(token, courseData);
    revalidatePath("/dashboard/courses");
    return {
      success: true,
      message: response.message,
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "An error occurred while creating the course. Please try again.",
    };
  }
}
