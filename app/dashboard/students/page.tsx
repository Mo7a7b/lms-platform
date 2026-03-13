import { cookies } from "next/headers";
import { GetUserData } from "@/lib/api";
import ReviewsTable from "@/components/dashboard/ReviewsTable";

export default async function StudentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return <p className="text-red-500">Access Denied</p>;

  const { role } = (await GetUserData(token)).user;

  if (role !== "Instructor")
    return <p className="text-red-500">Access Denied</p>;

  return <ReviewsTable />;
}
