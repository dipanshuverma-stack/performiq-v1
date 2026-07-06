export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/syllabus/:path*",
    "/revision/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/progress/:path*",
    "/analytics/:path*",
    "/mocks/:path*",
    "/mistakes/:path*",
    "/history/:path*",
    "/exams/:path*",
  ],
};