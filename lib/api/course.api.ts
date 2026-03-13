import { httpClient } from "@/lib/http/httpClient";

export async function CreateCourse(
  url: string,
  {
    arg,
  }: {
    arg: {
      token: string;
      courseData: {
        title: string;
        description: string;
        poster: string;
        price: number;
        requirements: string[];
        whatYouWillLearn: string[];
        category: App.CourseCategory;
      };
    };
  },
) {
  const response = await httpClient.post(url, arg.courseData, {
    headers: {
      Authorization: `Bearer ${arg.token}`,
    },
  });
  return response.data;
}

export async function getInstructorCourses(token: string) {
  const response = await httpClient.get("/course/instructor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getCourseById(courseId: string) {
  const response = await httpClient.get(`/course/${courseId}`);
  return response.data;
}

export async function updateCourse(
  token: string,
  courseId: string,
  courseData: {
    title: string;
    description: string;
    poster: string;
    price: number;
    requirements: string[];
    whatYouWillLearn: string[];
    category: App.CourseCategory;
  },
) {
  const response = await httpClient.put(`/course/${courseId}`, courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function changeCourseStatus(
  token: string,
  courseId: string,
  status: "Published" | "Archived",
) {
  const response = await httpClient.put(
    `/course/${courseId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function deleteCourse(token: string, courseId: string) {
  const response = await httpClient.delete(`/course/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getInstructorAnalytics(token: string) {
  const response = await httpClient.get("/analytics/instructor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAllCourses(
  page: number = 1,
  limit: number = 10,
): Promise<{
  message: string;
  courses: App.Course[];
  pagination: App.Pagination;
}> {
  const response = await httpClient.get("/course", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
}
