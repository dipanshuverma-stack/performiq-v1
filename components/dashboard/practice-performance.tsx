export function PracticePerformanceSection({ data, accuracyTrend, qpmTrend }: any) {
  return (
    <div className="bg-white rounded-xl shadow border p-6 border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Practice Performance</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Accuracy</p>
          <p className="text-2xl font-bold">{data?.averageAccuracy}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Avg QPM</p>
          <p className="text-2xl font-bold">{data?.averageQPM?.toFixed(2)}</p>
        </div>
      </div>
      {/* You would render your Chart components here using accuracyTrend and qpmTrend */}
    </div>
  );
}
