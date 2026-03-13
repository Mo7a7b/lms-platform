import { httpClient } from "@/lib/http/httpClient";

export async function createReview(
  token: string,
  reviewData: { rating: number; comment: string; courseId: string },
): Promise<{ message: string; review: App.Review }> {
  const response = await httpClient.post(`/review`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getReviewsByCourseId(
  courseId: string,
  page?: number,
  limit?: number,
): Promise<{ message: string; reviews: App.Review[] }> {
  const response = await httpClient.get(
    `/review/course/${courseId}?page=${page}&limit=${limit}`,
  );
  return response.data;
}

export async function updateReview(
  token: string,
  reviewData: { reviewId: string; rating: number; comment: string },
): Promise<{ message: string; review: App.Review }> {
  const response = await httpClient.put(`/review`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteReview(
  token: string,
  reviewId: string,
): Promise<{ message: string }> {
  const response = await httpClient.delete(`/review/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getInstructorReviews(token: string): Promise<{
  message: string;
  reviews: App.Review[];
  pagination: App.Pagination;
}> {
  const response = await httpClient.get(`/review/instructor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
