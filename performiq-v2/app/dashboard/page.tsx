import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {session?.user?.name}
      </h1>

      <p>{session?.user?.email}</p>

      {session?.user?.image && (
        <img
          src={session.user.image}
          alt="Profile"
          className="w-20 h-20 rounded-full mt-4"
        />
      )}
    </div>
  );
}