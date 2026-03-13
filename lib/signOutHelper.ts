const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  (typeof process.env.BACKEND_URL === "string"
    ? process.env.BACKEND_URL
    : null) ??
  "http://localhost:3000";

export async function signOutFromClient(): Promise<void> {
  const res = await fetch(`${getBackendUrl()}/auth/signout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to logout");
  }
}
