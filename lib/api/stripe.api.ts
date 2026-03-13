import { httpClient } from "../http/httpClient";

// Stripe Connect
export async function connectStripeAccount(token: string) {
  try {
    const response = await httpClient.post(
      "/stripe/connect",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data; // returns {message:string; url: string}
  } catch (error) {
    throw error;
  }
}

export async function enrollIntoCourse(token: string, courseId: number) {
  try {
    const response = await httpClient.post(
      "/stripe/checkout",
      { courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data; // returns {message:string; url: string; sessionId:string}
  } catch (error) {
    throw error;
  }
}

// get dash link
export async function GetStripeDashboard(token: string) {
  try {
    const response = await httpClient.get("/stripe/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // returns {message:string; url: string}
  } catch (error) {
    throw error;
  }
}
