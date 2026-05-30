export default function OnboardingPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Setup Your Exam Profile
      </h1>

      <form className="space-y-4">
        <div>
          <label className="block mb-1">Exam Name</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="UPSC CSE"
          />
        </div>

        <div>
          <label className="block mb-1">Target Year</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="2027"
          />
        </div>

        <button
          className="bg-black text-white px-4 py-2 rounded"
          type="submit"
        >
          Create Profile
        </button>
      </form>
    </main>
  );
}