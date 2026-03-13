import { httpClient } from "@/lib/http/httpClient";

export async function GetUserData(token: string) {
  try {
    const response = await httpClient.get("/auth/user-data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response Success: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function UpdateUserPassword(
  token: string,
  oldPassword: string,
  newPassword: string,
) {
  const response = await httpClient.put(
    "/auth/update-password",
    {
      currentPassword: oldPassword,
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function DeleteUserAccount(token: string, password: string) {
  const response = await httpClient.delete("/auth/delete-account", {
    data: {
      password,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function UpdateUserProfilePicture(
  token: string,
  profileImg: File | null,
) {
  const formData = new FormData();
  if (profileImg) {
    formData.append("picture", profileImg);
  }

  const response = await httpClient.put("/auth/update-profile", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getInstructors(page: number = 1, limit: number = 3) {
  const response = await httpClient.get("/auth/instructors", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
}

export async function getInstructorById(instructorId: string) {
  const response = await httpClient.get(`/auth/instructors/${instructorId}`);
  return response.data;
}
