"use client";

import { useState } from "react";
import {
  Subject,
  Difficulty,
  RevisionStatus,
} from "@prisma/client";
import { HistoryCard } from "./history-card";
import { SessionDetailDrawer } from "./SessionDetailDrawer";

interface TimelineSession {
  id: string;
  subject: Subject;
  topic: string;
  createdAt: Date | string; // Handles both raw DB and serialized wire formats
  accuracy: number;
  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  qpm: number;
  durationSeconds: number;
  difficulty?: Difficulty | null;
  confidenceScore?: number | null;
  revisionStatus?: RevisionStatus | null;
  notes?: string | null;
}

interface TimelineProps {
  sessions: TimelineSession[];
}

/**
 * Robust timestamp evaluator.
 * Maps session dates into human-readable buckets (Today, Yesterday, etc.)
 */
function formatRollingMarker(dateInput: Date | string): { 
  group: "Today" | "Yesterday" | "Last 7 Days" | "Last 30 Days" | "Older"; 
  relativeTime: string 
} {
  const target = new Date(dateInput);
  
  if (isNaN(target.getTime())) {
    return { group: "Older", relativeTime: "--" };
  }

  const diffMs = Date.now() - target.getTime();
  const diffDays = Math.floor(diffMs / 86400000); 

  const timeString = target.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (diffDays === 0) return { group: "Today", relativeTime: `Today • ${timeString}` };
  if (diffDays === 1) return { group: "Yesterday", relativeTime: `Yesterday • ${timeString}` };
  if (diffDays < 7) return { group: "Last 7 Days", relativeTime: `${diffDays} days ago` };
  if (diffDays < 30) return { group: "Last 30 Days", relativeTime: "Within Last 30 Days" };
  
  return { 
    group: "Older", 
    relativeTime: target.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) 
  };
}

export function HistoryTimeline({ sessions }: TimelineProps) {
  const [selectedSession, setSelectedSession] = useState<TimelineSession | null>(null);

  // Grouping logic for the UI timeline
  const grouped: Record<string, Array<TimelineSession & { relativeTime: string }>> = {
    Today: [], Yesterday: [], "Last 7 Days": [], "Last 30 Days": [], Older: [],
  };

  for (const session of sessions) {
    const marker = formatRollingMarker(session.createdAt);
    grouped[marker.group].push({ ...session, relativeTime: marker.relativeTime });
  }

  const markersOrder = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Older"] as const;

  return (
    <div className="space-y-6 relative">
      {markersOrder.map((marker) => {
        const records = grouped[marker];
        if (records.length === 0) return null;

        return (
          <div key={marker} className="space-y-3">
            <div className="flex items-center space-x-4">
              <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">{marker}</h2>
              <div className="h-[1px] bg-gray-200 flex-grow" />
            </div>
            <div className="space-y-3">
              {records.map((sessionItem) => (
                <button 
                  key={sessionItem.id} 
                  onClick={() => setSelectedSession(sessionItem)}
                  className="w-full text-left outline-none focus:ring-2 focus:ring-blue-500/40 rounded-2xl block"
                >
                  <HistoryCard session={sessionItem} relativeTime={sessionItem.relativeTime} />
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <SessionDetailDrawer 
        session={selectedSession} 
        onClose={() => setSelectedSession(null)} 
      />
    </div>
  );
}