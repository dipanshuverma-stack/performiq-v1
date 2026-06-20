"use client";

import { SmartLink as Link } from "@/components/smart-link";
import { CalendarDays } from "lucide-react";

interface MockHistoryProps {
  mocks: any[];
}

export default function MockHistory({
  mocks,
}: MockHistoryProps) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            HISTORY
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Mock Performance Timeline
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track every mock attempt and monitor your progress over time.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mocks.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.06] bg-[#0E121B] p-12 text-center">
            <p className="text-muted-foreground">No mock tests yet. Complete your first one above!</p>
          </div>
        ) : (
          mocks.map((mock: any) => {
            const formattedDate = new Date(mock.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={mock.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/[0.06]
                  bg-[#0E121B]
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-indigo-500/20
                "
              >
                {/* Left Accent Bar */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500" />

                {/* Subtle Hover Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{mock.exam}</h3>
                    <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">
                      {mock.mockType}
                    </p>
                    {mock.title && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {mock.title}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formattedDate}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      SCORE
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-foreground">
                      {mock.score}
                    </h2>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      ACCURACY
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                      {mock.accuracy.toFixed(1)}%
                    </h2>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/mocks/${mock.id}`}
                    className="
                      text-sm font-semibold text-indigo-400 hover:text-indigo-300 
                      transition-colors flex items-center gap-1
                    "
                  >
                    View Detailed Report →
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}