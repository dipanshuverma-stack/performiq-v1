interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`
        animate-pulse 
        rounded-xl 
        bg-white/[0.04] 
        border 
        border-white/[0.02]
        ${className}
      `} 
    />
  );
}

// Composition block layout for standard cards
export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <div className="flex justify-between items-baseline pt-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}