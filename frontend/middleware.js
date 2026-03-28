import { NextResponse } from "next/server";

const PUBLIC_ONLY_ROUTES = ["/login", "/signup"];
const PUBLIC_ROUTES = [
  "/",
  "/resend-verification",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];

function matchesRoute(pathname, routes) {
  return routes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicOnlyRoute = matchesRoute(pathname, PUBLIC_ONLY_ROUTES);
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);

  if (token && isPublicOnlyRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search || ""}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
