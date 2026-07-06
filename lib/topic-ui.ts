export const SUBJECT_LABELS: Record<string, string> = {
  REASONING: "Reasoning",
  QUANTITATIVE_APTITUDE: "Quant",
  ENGLISH_LANGUAGE: "English",
  GENERAL_AWARENESS: "GA",
  COMPUTER_APTITUDE: "Computer",
};

export const SUBJECT_COLORS: Record<string, string> = {
  REASONING: "bg-blue-50 text-blue-700 ring-blue-200",
  QUANTITATIVE_APTITUDE: "bg-purple-50 text-purple-700 ring-purple-200",
  ENGLISH_LANGUAGE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  GENERAL_AWARENESS: "bg-amber-50 text-amber-700 ring-amber-200",
  COMPUTER_APTITUDE: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

export const ACTION_MAP: Record<string, { icon: string; style: string }> = {
  "Revise": { icon: "🔴", style: "text-red-700 bg-red-50 ring-red-200 font-bold" },
  "Concept Building": { icon: "🟣", style: "text-purple-700 bg-purple-50 ring-purple-200 font-semibold" },
  "Timed Practice": { icon: "🔵", style: "text-blue-700 bg-blue-50 ring-blue-200 font-semibold" },
  "Maintain": { icon: "🟢", style: "text-gray-600 bg-gray-50 ring-gray-200 opacity-80" },
};

export const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-green-50 text-green-700 border-green-200",
};

export function getScoreColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-500";
}