export function DashboardHeader({ user }: { user: any }) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Welcome {user.name ?? "Guest"} 👋
      </h1>
    </div>
  );
}