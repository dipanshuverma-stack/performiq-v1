import Link from "next/link";

const exams = [
  {
    name: "SBI PO Prelims",
    questions: 100,
    duration: 60,
  },
  {
    name: "SBI Clerk Prelims",
    questions: 100,
    duration: 60,
  },
  {
    name: "IBPS PO Prelims",
    questions: 100,
    duration: 60,
  },
  {
    name: "IBPS Clerk Prelims",
    questions: 100,
    duration: 60,
  },
  {
    name: "RRB PO Prelims",
    questions: 80,
    duration: 45,
  },
];

export default function ExamModePage() {
  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Exam Mode
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.name}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-xl font-semibold">
                {exam.name}
              </h2>

              <div className="mt-4 space-y-2">
                <p>
                  Questions:
                  {" "}
                  {exam.questions}
                </p>

                <p>
                  Duration:
                  {" "}
                  {exam.duration}
                  {" "}
                  mins
                </p>
              </div>

              <Link
                href={`/exam-mode/start?exam=${encodeURIComponent(
                  exam.name
                )}`}
                className="inline-block mt-6 bg-black text-white px-4 py-2 rounded"
              >
                Start Exam
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}