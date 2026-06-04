type Props = {
  mockId: string;
  userId: string;
  mockType: "PRELIMS" | "MAINS";
};

export default function SubjectBreakdownForm({
  mockId,
  userId,
  mockType,
}: Props) {
  const subjects =
    mockType === "PRELIMS"
      ? [
          "Reasoning",
          "Quant",
          "English",
        ]
      : [
          "Reasoning",
          "Quant",
          "English",
          "GA",
          "Computer",
        ];

  return (
    <>
      <input
        type="hidden"
        name="mockId"
        value={mockId}
      />

      <input
        type="hidden"
        name="userId"
        value={userId}
      />

      <div className="space-y-6">
        {subjects.map((subject) => (
          <div
            key={subject}
            className="border rounded-xl p-4"
          >
            <h3 className="font-semibold mb-4">
              {subject}
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                name={`${subject}_total`}
                placeholder="Questions"
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                name={`${subject}_correct`}
                placeholder="Correct"
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                name={`${subject}_incorrect`}
                placeholder="Incorrect"
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}