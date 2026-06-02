import Link from "next/link";
import type { ReactNode } from "react";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Container */}
      <aside className="w-64 bg-black text-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">
          PerformIQ
        </h1>

        <nav className="space-y-6">
          {/* Study Section */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 mb-2">
              Study
            </h2>

            <div className="space-y-2">
              <Link href="/dashboard" prefetch={false} className="block hover:text-green-400">
                Dashboard
              </Link>

              <Link href="/syllabus" prefetch={false} className="block hover:text-green-400">
                Syllabus
              </Link>

              <Link href="/tasks" prefetch={false} className="block hover:text-green-400">
                Tasks
              </Link>

              <Link href="/revision" prefetch={false} className="block hover:text-green-400">
                Revision
              </Link>
            </div>
          </div>

          {/* Practice Section */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 mb-2">
              Practice
            </h2>

            <div className="space-y-2">
              <Link href="/practice" prefetch={false} className="block hover:text-green-400">
                Practice Timer
              </Link>

              <Link href="/practice/history" prefetch={false} className="block hover:text-green-400">
                Practice History
              </Link>

              <Link href="/practice/analytics" prefetch={false} className="block hover:text-green-400">
                Practice Analytics
              </Link>

              <Link href="/mocks" prefetch={false} className="block hover:text-green-400">
                Mock Tests
              </Link>

              <Link href="/mistakes" prefetch={false} className="block hover:text-green-400">
                Mistake Journal
              </Link>
            </div>
          </div>

          {/* Intelligence Section */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 mb-2">
              Intelligence
            </h2>

            <div className="space-y-2">
              <Link href="/daily-plan" prefetch={false} className="block hover:text-green-400">
                Daily Plan
              </Link>

              <Link href="/coach" prefetch={false} className="block hover:text-green-400">
                Study Coach
              </Link>

              <Link href="/revision/intelligence" prefetch={false} className="block hover:text-green-400">
                Smart Revision
              </Link>
            </div>
          </div>

          {/* Insights Section */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 mb-2">
              Insights
            </h2>

            <div className="space-y-2">
              <Link href="/progress" prefetch={false} className="block hover:text-green-400">
                Progress
              </Link>

              <Link href="/analytics" prefetch={false} className="block hover:text-green-400">
                Analytics
              </Link>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 mb-2">
              Account
            </h2>

            <div className="space-y-2">
              <Link href="/notifications" prefetch={false} className="block hover:text-green-400">
                Notifications
              </Link>

              <Link href="/profile" prefetch={false} className="block hover:text-green-400">
                Profile
              </Link>

              <Link href="/settings" prefetch={false} className="block hover:text-green-400">
                Settings
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Primary Workspace View */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}