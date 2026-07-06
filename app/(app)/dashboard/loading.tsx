// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Hero Skeleton */}
      <div className="h-[180px] bg-white/[0.05] border border-white/[0.08] rounded-3xl animate-pulse" />

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-white/[0.05] border border-white/[0.08] rounded-3xl animate-pulse"
          />
        ))}
      </div>

      {/* Weekly Planner Skeleton */}
      <div className="h-80 bg-white/[0.05] border border-white/[0.08] rounded-3xl animate-pulse" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Focus Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-10 w-48 bg-white/[0.05] rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white/[0.05] border border-white/[0.08] rounded-3xl animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Priorities Widget */}
        <div className="lg:col-span-5">
          <div className="h-10 w-48 bg-white/[0.05] rounded-xl animate-pulse mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/[0.05] border border-white/[0.08] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Study Plan Skeleton */}
      <div className="h-96 bg-white/[0.05] border border-white/[0.08] rounded-3xl animate-pulse" />
    </div>
  );
}