import { CheckCircle2, Target, HelpCircle, BarChart3 } from "lucide-react";

interface MockSaveSuccessProps {
  score: number;
  accuracy: number;
  questions: number;
  onNewMock: () => void;
  onViewMocks: () => void;
}

export default function MockSaveSuccess({
  score,
  accuracy,
  questions,
  onNewMock,
  onViewMocks,
}: MockSaveSuccessProps) {
  return (
    <div className="mx-auto max-w-md text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/5">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h2 className="mb-2 text-3xl font-extrabold text-white tracking-tight">
        Mock Saved Successfully
      </h2>
      <p className="mb-8 text-sm text-slate-400">
        Your performance data has been analyzed and logged.
      </p>

      {/* Snapshot Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <Target className="mx-auto mb-2 h-5 w-5 text-indigo-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Score</p>
          <p className="text-xl font-bold text-white">{score.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <BarChart3 className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Accuracy</p>
          <p className="text-xl font-bold text-white">{accuracy.toFixed(1)}%</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <HelpCircle className="mx-auto mb-2 h-5 w-5 text-violet-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Qs</p>
          <p className="text-xl font-bold text-white">{questions}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onViewMocks}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold tracking-widest text-white shadow-xl shadow-indigo-900/20 hover:from-blue-500 hover:to-indigo-500 transition-all uppercase text-xs"
        >
          View Mock Dashboard
        </button>
        <button
          type="button"
          onClick={onNewMock}
          className="w-full rounded-xl border border-white/[0.08] bg-transparent py-4 font-bold tracking-widest text-slate-300 hover:bg-white/[0.02] hover:text-white transition-all uppercase text-xs"
        >
          Log Another Mock
        </button>
      </div>
    </div>
  );
}