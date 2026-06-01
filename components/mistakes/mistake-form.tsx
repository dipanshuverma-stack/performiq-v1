import { createMistake } from "@/app/actions/mistake-journal";

export default function MistakeForm() {
  return (
    <form
      action={createMistake}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        name="subject"
        placeholder="Subject"
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="topic"
        placeholder="Topic"
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        name="question"
        placeholder="What mistake did you make?"
        className="w-full border p-2 rounded"
        rows={4}
        required
      />

      <textarea
        name="explanation"
        placeholder="Correct explanation"
        className="w-full border p-2 rounded"
        rows={4}
      />

      <input
        name="source"
        placeholder="Mock/Test Source"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Mistake
      </button>
    </form>
  );
}