import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">
          Welcome {session?.user?.name} 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Preparing for SBI PO • IBPS PO • RRB PO
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">Study Time</h3>
            <p className="text-3xl font-bold mt-2">0h</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">Tasks Done</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">Mock Tests</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Today's Tasks
          </h2>

          <ul className="space-y-3">
            <li>□ Quantitative Aptitude</li>
            <li>□ Reasoning Ability</li>
            <li>□ English Language</li>
            <li>□ Current Affairs</li>
          </ul>
        </div>
      </div>
    </main>
  );
}