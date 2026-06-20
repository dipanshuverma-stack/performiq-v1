"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createTask } from "@/app/actions/task";
import { GlassCard } from "@/components/ui/glass-card";
import { ActionButton } from "@/components/ui/action-button";
import { Plus, Loader2 } from "lucide-react";

interface FormContentProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function FormContent({ inputRef }: FormContentProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        name="title"
        placeholder="What are you studying today?"
        required
        disabled={pending}
        autoComplete="off"
        maxLength={120}
        className="flex-1 bg-black/40 border border-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-all duration-200"
      />
      <ActionButton 
        type="submit" 
        disabled={pending} 
        className="gap-2 shrink-0 min-w-[120px]"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add Task
          </>
        )}
      </ActionButton>
    </>
  );
}

export function TaskInput() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      await createTask(formData);
      formRef.current?.reset();
      inputRef.current?.focus();           // Fast re-focus for rapid task entry
    } catch (error) {
      console.error("Failed to create task:", error);
      // TODO: Replace with toast notification later
    }
  };

  return (
    <GlassCard glow className="p-6">
      <div className="select-none">
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Quick Add Task
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">
          Break your preparation into small actionable goals.
        </p>
      </div>
      
      <form 
        ref={formRef} 
        action={handleSubmit}
        className="flex flex-col sm:flex-row gap-3"
      >
        <FormContent inputRef={inputRef} />
      </form>
    </GlassCard>
  );
}