export const SUBJECTS = [
  { id: "Quant", label: "Quantitative Aptitude", icon: "📐", color: "blue" },
  { id: "Reasoning", label: "Logical Reasoning", icon: "🧩", color: "purple" },
  { id: "English", label: "English Language", icon: "✍️", color: "emerald" },
  { id: "GA", label: "General Awareness", icon: "🌍", color: "amber" },
  { id: "Computer", label: "Computer Awareness", icon: "💻", color: "cyan" },
] as const;

export type SubjectId = typeof SUBJECTS[number]["id"];

export const SUBJECT_MAP = SUBJECTS.reduce((acc, subject) => {
  acc[subject.id] = subject;
  return acc;
}, {} as Record<SubjectId, typeof SUBJECTS[number]>);