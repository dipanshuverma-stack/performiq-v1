"use client";

import { useRef, useTransition, useState, useMemo } from "react";
import { SessionTimer, SessionTimerRef } from "@/components/core/session/SessionTimer";
import { savePracticeSession } from "@/app/actions/practice";
import { toast } from "sonner";

export default function PracticePageClient() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<SessionTimerRef>(null);
  const isSavingRef = useRef(false);

  // Tab Isolation & Idempotency Handshakes
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const [sessionUuid, setSessionUuid] = useState(() => crypto.randomUUID());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSavingRef.current || isPending) return;
    isSavingRef.current = true;

    const formData = new FormData(event.currentTarget);
    const total = Number(formData.get("totalQuestions"));
    const correct = Number(formData.get("correctQuestions"));

    if (correct > total) {
      toast.error("Correct questions cannot exceed total questions.");
      isSavingRef.current = false;
      return;
    }

    const durationSeconds = timerRef.current?.finish() ?? 0;
    if (durationSeconds === 0) {
      toast.error("Start the timer before saving a session.");
      isSavingRef.current = false;
      return;
    }

    formData.set("durationSeconds", durationSeconds.toString());
    formData.set("sessionUuid", sessionUuid);

    startTransition(async () => {
      try {
        await savePracticeSession(formData);

        toast.success("Practice session saved successfully!");

        timerRef.current?.reset();
        formRef.current?.reset();
        setSessionUuid(crypto.randomUUID());
      } catch (error) {
        console.error("[PracticeClient] Save operational fault:", error);
        toast.error("Failed to save session. Connection problem encountered.");
      } finally {
        isSavingRef.current = false;
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isPending} className="space-y-4 group disabled:opacity-75 transition-opacity">
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Subject
            </label>
            <select
              name="subject"
              className="w-full border rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Reasoning">Reasoning</option>
              <option value="Quant">Quant</option>
              <option value="English">English</option>
              <option value="GA">GA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Topic
            </label>
            <input
              name="topic"
              type="text"
              placeholder="Puzzle"
              className="w-full border rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="py-2">
            <SessionTimer 
              ref={timerRef}
              sessionId={sessionId}
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Total Questions
            </label>
            <input
              name="totalQuestions"
              type="number"
              min="1"
              placeholder="0"
              className="w-full border rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Correct Questions
            </label>
            <input
              name="correctQuestions"
              type="number"
              min="0"
              placeholder="0"
              className="w-full border rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition flex items-center justify-center font-medium min-h-[48px]"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Recording Practice Session...</span>
              </div>
            ) : (
              "Save Session"
            )}
          </button>

        </fieldset>
      </form>
    </div>
  );
}