export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Skeleton Header */}
      <div className="h-8 w-1/3 bg-slate-200 rounded" />
      
      {/* Skeleton Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}