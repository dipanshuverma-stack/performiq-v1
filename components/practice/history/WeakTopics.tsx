interface WeakTopicsProps {
  topics: Array<{
    topic: string;
    _sum: { mistakeCount: number | null };
  }>;
}

export function WeakTopics({ topics }: WeakTopicsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
        🔥 Weak Topics <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-md border border-rose-100 font-bold uppercase tracking-wider">Mistake Book Base</span>
      </h3>
      <div className="space-y-2.5">
        {topics.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No structural mistakes logged yet.</p>
        ) : (
          topics.map((item) => (
            <div key={item.topic} className="flex items-center justify-between text-xs font-medium">
              <span className="text-gray-700 truncate max-w-[70%]">{item.topic}</span>
              <div className="flex-grow mx-2 border-b border-dashed border-gray-200" />
              <span className="text-rose-600 font-bold shrink-0 bg-rose-50/50 border border-rose-100 rounded px-2 py-0.5">
                ❌ {item._sum.mistakeCount ?? 0} mistakes
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}