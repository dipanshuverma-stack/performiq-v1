export function ExamMetrics({ activeExam, readiness, forecast, performance }: any) {
  return (
    <div className="bg-white rounded-xl shadow border p-6 border-gray-100">
      <h2 className="text-2xl font-bold border-b pb-3 text-gray-800">
        {activeExam?.name ?? "No Active Exam"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Readiness</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{readiness?.readiness ?? 0}%</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Forecast</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{forecast?.forecastScore ?? "-"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Performance</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{performance?.score ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}