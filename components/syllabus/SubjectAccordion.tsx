import { SubjectCard } from "./SubjectCard";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectAccordionProps {
  title: string;
  completed: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function SubjectAccordion({
  title,
  completed,
  total,
  isOpen,
  onToggle,
  children,
}: SubjectAccordionProps) {
  return (
    <div className="space-y-3">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left focus:outline-none group relative"
      >
        <SubjectCard 
          title={title} 
          completed={completed} 
          total={total} 
          isParentExpanded={isOpen} 
        />

        {/* Chevron Indicator */}
        <div className={cn(
          "absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 transition-transform duration-300 pointer-events-none",
          isOpen ? "rotate-90 text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
        )}>
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </button>

      {/* Expanded Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-out",
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pl-4 sm:pl-6 border-l border-white/10 space-y-3 pt-3 pb-1">
          {children}
        </div>
      </div>
    </div>
  );
}