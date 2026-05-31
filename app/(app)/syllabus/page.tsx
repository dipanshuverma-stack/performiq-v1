import { syllabus } from "@/lib/syllabus";
import { completeTopic } from "@/app/actions/topic-progress";

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
              <form
                key={topic}
                action={async () => {
                  "use server";
                  await completeTopic(topic);
                }}
              >
                <button
                  type="submit"
                  className="w-full border rounded-lg p-3 text-left hover:bg-gray-50"
                >
                  ✅ {topic}
                </button>
              </form>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}