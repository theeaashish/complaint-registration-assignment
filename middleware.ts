import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getSession();
  const user = session?.user;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && user.role !== "admin" && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    user &&
    user.role !== "admin" &&
    pathname === "/" &&
    request.nextUrl.searchParams.get("tab") === "admin"
  ) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("tab");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
