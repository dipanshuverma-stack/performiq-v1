"use client";

interface Props {
  mockType: "PRELIMS" | "MAINS";
  children: (subject: string) => React.ReactNode;
}

export default function SubjectPerformanceSection({
  mockType,
  children,
}: Props) {
  const subjects =
    mockType === "PRELIMS"
      ? ["Reasoning", "Quant", "English"]
      : ["Reasoning", "Quant", "English", "GA", "Computer"];

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          SUBJECT PERFORMANCE
        </p>

        <div className="h-px bg-white/[0.06]" />
      </div>

      <div className="space-y-5">
        {subjects.map((subject) => (
          <div key={subject}>
            {children(subject)}
          </div>
        ))}
      </div>
    </section>
  );
}