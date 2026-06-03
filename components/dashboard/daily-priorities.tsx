export function DailyPriorities({ priorities }: { priorities: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow border p-6 border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Today's Priorities</h2>
      <div className="space-y-4">
        {priorities.map((topic, i) => (
          <div key={i} className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold">{topic.topic}</h3>
            <p className="text-sm text-gray-600">Priority: {topic.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}