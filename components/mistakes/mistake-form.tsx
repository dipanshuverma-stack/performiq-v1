import { createMistake } from "@/app/actions/mistake-journal";

// You can import your subject list from your config file
const SUBJECTS = [
  "Reasoning",
  "Quantitative Aptitude",
  "English Language",
  "General Awareness",
  "Computer Awareness",
];

export default function MistakeForm() {
  return (
    <form
      action={createMistake}
      className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8 space-y-10"
    >
      {/* Header */}
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          MISTAKE LOGGER
        </span>
        <h2 className="text-3xl font-black tracking-tight text-zinc-100">
          Log New Mistake
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Record every mistake to build your personal revision intelligence and avoid repeating errors.
        </p>
      </div>

      {/* Section: Basic Information */}
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            BASIC INFORMATION
          </p>
          <div className="mt-2 h-px bg-white/[0.06]" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <select
            name="subject"
            className="h-12 rounded-2xl border border-white/[0.08] bg-[#0B1020] px-5 focus:outline-none focus:border-red-500/30 text-zinc-100 transition-colors"
            required
          >
            <option value="">Select Subject</option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <input
            name="topic"
            placeholder="Topic"
            className="h-12 rounded-2xl border border-white/[0.08] bg-[#0B1020] px-5 focus:outline-none focus:border-red-500/30 text-zinc-100 placeholder:text-zinc-600 transition-colors"
            required
          />
        </div>
      </div>

      {/* Section: Mistake Details */}
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            MISTAKE DETAILS
          </p>
          <div className="mt-2 h-px bg-white/[0.06]" />
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-200">
              Question / Mistake
            </label>
            <textarea
              name="question"
              rows={6}
              placeholder="Paste the question or describe the specific error you made..."
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0B1020] px-5 py-4 text-zinc-100 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-red-500/30 transition-colors"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-200">
              Correct Explanation
            </label>
            <textarea
              name="explanation"
              rows={6}
              placeholder="Break down the correct logic or identify the concept you missed..."
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0B1020] px-5 py-4 text-zinc-100 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-red-500/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section: Metadata */}
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            METADATA
          </p>
          <div className="mt-2 h-px bg-white/[0.06]" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-200">Source</label>
            <select name="source" className="h-12 w-full rounded-2xl border border-white/[0.08] bg-[#0B1020] px-5 text-zinc-100 focus:outline-none focus:border-red-500/30">
              <option value="">Select Source</option>
              <option value="PRACTICE">Practice</option>
              <option value="MOCK">Mock Test</option>
              <option value="PYQ">Previous Year Paper</option>
              <option value="CUSTOM">Manual Entry</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-200">Difficulty</label>
            <select name="difficulty" className="h-12 w-full rounded-2xl border border-white/[0.08] bg-[#0B1020] px-5 text-zinc-100 focus:outline-none focus:border-red-500/30">
              <option value="">Select Difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submission */}
      <div className="pt-4 border-t border-white/[0.06]">
        <button
          type="submit"
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:from-red-500 hover:to-orange-400 hover:shadow-xl hover:shadow-red-900/30"
        >
          Save Mistake
        </button>
      </div>
    </form>
  );
}