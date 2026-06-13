export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/syllabus/:path*",
    "/revision/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};