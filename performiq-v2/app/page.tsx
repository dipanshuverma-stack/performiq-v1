import { signIn } from "@/auth";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/dashboard",
          });
        }}
      >
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-black text-white"
        >
          Continue with Google
        </button>
      </form>
    </main>
  );
}