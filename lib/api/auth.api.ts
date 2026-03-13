import { httpClient } from "@/lib/http/httpClient";

export async function signUp(
  url: string,
  {
    arg,
  }: {
    arg: {
      name: string;
      email: string;
      password: string;
      role: "Student" | "Instructor";
    };
  },
) {
  const response = await httpClient.post(url, arg);
  return response.data;
}

export async function signIn(
  url: string,
  {
    arg,
  }: {
    arg: {
      email: string;
      password: string;
    };
  },
) {
  const response = await httpClient.post(url, arg);
  return response.data;
}
