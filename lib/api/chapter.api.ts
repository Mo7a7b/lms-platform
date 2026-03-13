import { httpClient } from "@/lib/http/httpClient";

export async function createChapter(
  token: string,
  courseId: number,
  order: number,
) {
  const response = await httpClient.post(
    "/chapter",
    {
      courseId,
      order,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function getChapterById(token: string, chapterId: string) {
  const response = await httpClient.get(`/chapter/${chapterId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateChapter(
  token: string,
  chapterId: string,
  courseId: string,
  title: string,
  isFreePreview: boolean,
) {
  const response = await httpClient.put(
    `/chapter/${chapterId}`,
    { title, courseId: Number(courseId), isFreePreview },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function reorderChapters(
  token: string,
  courseId: string,
  chapters: number[],
) {
  const response = await httpClient.put(
    "/course/reorderChapters",
    { chapters, courseId: Number(courseId) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function deleteChapter(
  token: string,
  chapterId: string,
  courseId: string,
) {
  const response = await httpClient.delete("/chapter", {
    data: {
      id: Number(chapterId),
      courseId: Number(courseId),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function reorderVideos(
  token: string,
  chapterId: number,
  videos: number[],
) {
  const response = await httpClient.put(
    "/chapter/reorderVideos",
    { videos, chapterId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}
