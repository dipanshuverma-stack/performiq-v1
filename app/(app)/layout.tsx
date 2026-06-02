import Link from "next/link";
import type { ReactNode } from "react";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
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
            prefetch={false}
            className="block hover:text-green-400"
          >
            Dashboard
          </Link>

          <Link
            href="/syllabus"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Syllabus
          </Link>

          <Link
            href="/tasks"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Tasks
          </Link>

          <Link
            href="/revision"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Revision
          </Link>

          <Link
            href="/mocks"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Mock Tests
          </Link>

          <Link
            href="/daily-plan"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Daily Plan
          </Link>

          <Link
            href="/coach"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Study Coach
          </Link>

          <Link
            href="/practice"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Practice Timer
          </Link>

          <Link
            href="/practice/history"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Practice History
          </Link>

          <Link
            href="/practice/analytics"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Practice Analytics
          </Link>

          <Link
            href="/revision/intelligence"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Smart Revision
          </Link>

          <Link
            href="/mistakes"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Mistake Journal
          </Link>

          <Link
            href="/progress"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Progress
          </Link>
          
          <Link
            href="/notifications"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Notifications
          </Link> 

          <Link
            href="/analytics"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Analytics
          </Link>

          <Link
            href="/profile"
            prefetch={false}
            className="block hover:text-green-400"
          >
            Profile
          </Link>

          <Link
            href="/settings"
            prefetch={false}
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