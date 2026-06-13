import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Sign in with Google
        </button>
      </form>
    </div>
  );
}