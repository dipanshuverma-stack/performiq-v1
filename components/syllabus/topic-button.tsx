"use client";

import { useOptimistic, useTransition } from "react";
import { completeTopic } from "@/app/actions/topic-progress";
import { toast } from "sonner";
import { Subject } from "@prisma/client"; // ✅ Fix: Imported the direct Subject enum keys

interface TopicButtonProps {
  subject: Subject;
  topic: string;
  initialCompleted: boolean;
}

export default function TopicButton({
  subject,
  topic,
  initialCompleted,
}: TopicButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic state automatically falls back to initialCompleted once the transition settles
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    initialCompleted,
    (currentState, newState: boolean) => newState
  );

  const handleToggle = async () => {
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("topic", topic);

    // Capture target state synchronously to secure async boundaries
    const nextState = !optimisticCompleted;

    startTransition(async () => {
      // 1. Instantly flip the visual UI state inside the transition context
      setOptimisticCompleted(nextState);

      try {
        await completeTopic(formData);
        
        // 2. Trigger success notification
        toast.success(
          nextState
            ? "Topic completed successfully"
            : "Topic marked incomplete"
        );
      } catch (error) {
        // 3. Next.js handles the UI rollback automatically here; we just notify the user
        // ✅ Fix: Cleaned up find-and-replace artifact string to read naturally
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      className={`w-full border rounded-xl p-4 text-left transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isPending ? "opacity-70 cursor-not-allowed" : ""
      } ${
        optimisticCompleted
          ? "bg-green-50/50 border-green-200 text-green-900 focus:ring-green-500"
          : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50/50 focus:ring-gray-900"
      }`}
    >
      <span className={`text-sm font-medium ${optimisticCompleted ? "line-through text-gray-400" : ""}`}>
        {topic}
      </span>
      
      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
        optimisticCompleted 
          ? "bg-green-600 border-green-600 text-white" 
          : "border-gray-300 group-hover:border-gray-400 bg-white"
      }`}>
        {optimisticCompleted && (
          <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}