import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();

  // If user is already logged in, redirect them to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to PerformIQ</h1>
      {/* This link triggers the sign-in flow */}
      <Link 
        href="/api/auth/signin" 
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
      >
        Sign In
      </Link>
    </div>
  );
}