import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { environments } from "./lib/data";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/events") ||
    url.pathname.startsWith("/sessions")
  ) {
    const environment = url.searchParams.get("environment");
    const isInEnvironments = environments.find((data) => data.name === environment?.trim());

    if (!environment || !isInEnvironments) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/events/:path*", "/sessions/:path*"],
};
