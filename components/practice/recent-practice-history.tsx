// components/recent-practice-history.tsx
import Link from "next/link";
import { Subject } from "@prisma/client";
import { SUBJECT_LABELS } from "@/config/syllabus";

export interface PracticeSessionData {
  id: string;            // Aligned with Prisma core model ID typing
  subject: Subject;
  topic: string;
  accuracy: number;
  createdAt: Date | string; // Dual type support safely handles raw DB objects and serialized payloads
}

interface RecentPracticeHistoryProps {
  sessions: PracticeSessionData[];
}

export default function RecentPracticeHistory({ sessions }: RecentPracticeHistoryProps) {
  return (
    <div className="bg-zinc-950 rounded-xl shadow-xl p-6 border border-zinc-900 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-100">Recent Sessions</h2>
        <Link 
          href="/practice/history" 
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline"
        >
          View All
        </Link>
      </div>
      
      {sessions.length === 0 ? (
        <p className="text-zinc-500 text-sm py-2">No practice sessions found yet.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="border border-zinc-900 bg-zinc-900/40 rounded-lg p-3 hover:bg-zinc-900/80 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-zinc-200 text-sm">
                    {SUBJECT_LABELS[session.subject]} • {session.topic}
                  </p>
                  
                  {/* Localized formatting parsed cleanly from either string or Date objects inline */}
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {new Date(session.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-100 text-base">
                    {session.accuracy.toFixed(1)}%
                  </p>
                  <p className="text-xs text-zinc-500">Accuracy</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}