"use client";

interface SessionTimerDisplayProps {
  elapsedSeconds: number; // Presentation layer only handles second increments
}

export function SessionTimerDisplay({ elapsedSeconds }: SessionTimerDisplayProps) {
  const hrs = Math.floor(elapsedSeconds / 3600);
  const mins = Math.floor((elapsedSeconds % 3600) / 60);
  const secs = elapsedSeconds % 60;

  const formattedTime = [
    hrs.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center shadow-inner">
      <div className="text-5xl font-bold font-mono text-gray-800 tracking-widest">
        {formattedTime}
      </div>
    </div>
  );
}