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
          <a href="/dashboard" className="block">
            Dashboard
          </a>

          <a href="/syllabus" className="block">
            Syllabus
          </a>

          <a href="/tasks" className="block">
            Tasks
          </a>

          <a href="/revision" className="block">
            Revision
          </a>

          <a href="/mocks" className="block">
            Mock Tests
          </a>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}