import { CONFIDENCE_LEVELS } from "@/lib/constants/practice";

interface CardProps {
  relativeTime: string;
  session: {
    id: string;
    subject: string;
    topic: string;
    accuracy: number;
    qpm: number;
    durationSeconds: number;
    totalQuestions: number;
    correctQuestions: number;
    incorrectQuestions: number;
    difficulty?: string | null;
    confidenceScore?: number | null;
    revisionStatus?: string | null;
  };
}

export function HistoryCard({ session, relativeTime }: CardProps) {
  const confidence = session.confidenceScore 
    ? CONFIDENCE_LEVELS[session.confidenceScore as keyof typeof CONFIDENCE_LEVELS] 
    : null;

  // Real-time colored accuracy classification rule maps
  const barColor = session.accuracy >= 85 ? "bg-emerald-500" : session.accuracy >= 70 ? "bg-amber-500" : "bg-rose-500";
  const trackColor = session.accuracy >= 85 ? "bg-emerald-100" : session.accuracy >= 70 ? "bg-amber-100" : "bg-rose-100";

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      
      <div className="space-y-3 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            🧠 {session.subject}
          </span>
          <h3 className="text-sm font-bold text-gray-800 truncate">{session.topic}</h3>
          <span className="text-xs text-gray-400 ml-auto sm:ml-0">{relativeTime}</span>
        </div>
        
        {/* Visual Premium Accuracy Horizontal Meter bar alignment block */}
        <div className="flex items-center gap-3">
          <div className={`h-2 w-24 rounded-full ${trackColor} overflow-hidden shrink-0 hidden xs:block`}>
            <div className={`h-full ${barColor}`} style={{ width: `${session.accuracy}%` }} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="font-bold text-gray-800">{session.accuracy}% Acc</span>
            <span>•</span>
            <span>{session.totalQuestions}Q ({session.correctQuestions}✓ {session.incorrectQuestions}✕)</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold flex items-center gap-0.5">⚡ {session.qpm.toFixed(2)} QPM</span>
          </div>
        </div>
      </div>

      {/* Decorative and Diagnostic Meta Attribute Pill Row */}
      <div className="flex flex-wrap items-center gap-1.5 shrink-0 sm:justify-end">
        {session.difficulty && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 font-semibold text-gray-600 uppercase">
            {session.difficulty}
          </span>
        )}
        
        {confidence && (
          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${confidence.color}`}>
            {confidence.label}
          </span>
        )}

        {session.revisionStatus && (
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border tracking-wide uppercase ${
            session.revisionStatus === "MASTERED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            session.revisionStatus === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border-amber-100" :
            "bg-rose-50 text-rose-700 border-rose-100"
          }`}>
            {session.revisionStatus === "UNRESOLVED" ? "❌ Weak" : session.revisionStatus.replace("_", " ")}
          </span>
        )}
      </div>

    </div>
  );
}