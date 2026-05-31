import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-8">
          PerformIQ
        </h1>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block hover:text-green-400"
          >
            Dashboard
          </Link>

          <Link
            href="/syllabus"
            className="block hover:text-green-400"
          >
            Syllabus
          </Link>

          <Link
            href="/tasks"
            className="block hover:text-green-400"
          >
            Tasks
          </Link>

          <Link
            href="/revision"
            className="block hover:text-green-400"
          >
            Revision
          </Link>

          <Link
            href="/mocks"
            className="block hover:text-green-400"
          >
            Mock Tests
          </Link>

          <Link
            href="/profile"
            className="block hover:text-green-400"
          >
            
            Profile
          </Link>
            <Link
  href="/analytics"
  className="block hover:text-green-400"
>
  Analytics
              </Link>
          <Link
            href="/settings"
            className="block hover:text-green-400"
          >
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}