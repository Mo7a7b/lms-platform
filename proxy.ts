import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/auth/login" ||
    request.nextUrl.pathname === "/auth/sign-up"
  ) {
    const loggedIn = request.cookies.get("academos-logged-in");
    if (loggedIn?.value) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/sign-up"],
};
