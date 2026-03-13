"use server";
import { UpdateUserPassword } from "@/lib/api";

export async function updatePassword(
  _: App.FormState,
  formData: FormData,
): Promise<App.FormState | void> {
  const oldPassword = formData.get("oldPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");
  const token = formData.get("token");
  if (newPassword === confirmPassword) {
    try {
      const res = await UpdateUserPassword(
        token as string,
        oldPassword as string,
        newPassword as string,
      );
      return res;
    } catch (err) {
      return {
        message:
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error ?? "An unknown error occurred",
      };
    }
  } else {
    return { message: "Confirm Password doesn't match the new Password" };
  }
}
