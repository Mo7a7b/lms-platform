"use server";
import { revalidatePath } from "next/cache";
import { UpdateUserProfilePicture } from "@/lib/api";

export async function updateUserProfile(
  _: App.FormState,
  formData: FormData,
): Promise<App.FormState | void> {
  console.log("Updating user profile");
  const profilePic = formData.get("profilePicture");
  const token = formData.get("token");
  try {
    const res = await UpdateUserProfilePicture(
      token as string,
      profilePic as File,
    );
    revalidatePath("/dashboard/settings");
    return {
      message: res.message,
    };
  } catch (err) {
    return {
      message:
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "An unknown error occurred",
    };
  }
}
