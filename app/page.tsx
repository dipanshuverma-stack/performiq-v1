import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main className="p-10">
        <a href="/api/auth/signin">
          Sign in with Google
        </a>
      </main>
    );
  }

  redirect("/onboarding");
}