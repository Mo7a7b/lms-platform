"use server";

import { updateCourse } from "../api";

export async function editCourse(_: App.FormState, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const poster = formData.get("poster") as string;
  const price = Number(formData.get("price") as string);
  const category = formData.get("category") as unknown as App.CourseCategory;
  const requirements = (formData.get("requirements") as string).split(",");
  const whatYouWillLearn = (formData.get("whatYouWillLearn") as string).split(
    ",",
  );
  const courseId = formData.get("courseId") as string;
  const token = formData.get("token") as string;
  try {
    const res = await updateCourse(token, courseId, {
      title,
      description,
      poster,
      price,
      category: category as App.CourseCategory,
      requirements,
      whatYouWillLearn,
    });
    return {
      success: true,
      message: res.message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update course",
    };
  }
}
