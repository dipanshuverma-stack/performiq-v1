import { syllabus } from "@/lib/syllabus";

export default function SyllabusPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Banking PO Syllabus
      </h1>

      {Object.entries(syllabus).map(([subject, topics]) => (
        <div
          key={subject}
          className="bg-white rounded-xl p-6 shadow mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 capitalize">
            {subject}
          </h2>

          <div className="grid gap-2">
            {topics.map((topic) => (
              <div
                key={topic}
                className="border rounded-lg p-3"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}