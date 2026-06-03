export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 bg-white rounded-xl shadow border border-gray-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64 bg-white rounded-xl shadow border" />
        <div className="h-64 bg-white rounded-xl shadow border" />
      </div>
    </div>
  );
}