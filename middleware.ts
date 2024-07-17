import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isLoggedIn = request.cookies.get("access_token")?.value;
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);
  const isPublicRoute = ["/page"].includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // it will call if login found
      return Response.redirect(new URL("/torus", nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    //  // it will call if the url 3000/{something}
    return Response.redirect(new URL("/", nextUrl));
  }

  return null;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
