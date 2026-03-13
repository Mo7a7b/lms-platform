import { httpClient } from "@/lib/http/httpClient";

export async function uploadVideoToDB(
  token: string,
  chapterId: number,
  videoData: {
    title: string;
    url: string;
    provider: string;
    duration: number;
    description: string;
    publicId?: string;
  },
) {
  const response = await httpClient.post(
    "/video",
    {
      chapterId,
      title: videoData.title,
      description: videoData.description,
      duration: videoData.duration,
      url: videoData.url,
      provider: videoData.provider,
      publicId: videoData.publicId,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

export async function deleteVideo(token: string, videoId: number) {
  const response = await httpClient.delete(`/video/${videoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateVideo(
  token: string,
  videoId: number,
  title: string,
  description: string,
  url?: string,
  duration?: number,
) {
  const response = await httpClient.put(
    `/video/${videoId}`,
    { title, description, url, duration },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function getVideoById(token: string, videoId: number) {
  const response = await httpClient.get(`/video/${videoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
