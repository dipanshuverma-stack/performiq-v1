"use client";

import { useState, useMemo } from "react";
import { Search, Info, ChevronUp, ChevronDown, HelpCircle } from "lucide-react";
import { TopicPriority } from "@/lib/intelligence/topic-priority";
import { SUBJECT_LABELS, SUBJECT_COLORS, ACTION_MAP, PRIORITY_COLORS, getScoreColor } from "@/lib/topic-ui";

type SortKey = "score" | "knowledgeScore" | "speedScore" | "masteryScore" | "weakMockCount" | "unresolvedMistakes";

export function TopicsDashboard({ initialPriorities }: { initialPriorities: TopicPriority[] }) {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDesc, setSortDesc] = useState(true);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    return initialPriorities
      .filter((p) => {
        const matchesSearch = p.topic.toLowerCase().includes(search.toLowerCase());
        const matchesSubject = subjectFilter === "ALL" || p.subject === subjectFilter;
        const matchesPriority = priorityFilter === "ALL" || p.priority === priorityFilter;
        return matchesSearch && matchesSubject && matchesPriority;
      })
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return b.unresolvedMistakes - a.unresolvedMistakes; // Tie-breaker
        return sortDesc ? Number(valB) - Number(valA) : Number(valA) - Number(valB);
      });
  }, [initialPriorities, search, subjectFilter, priorityFilter, sortKey, sortDesc]);

  // Global Summary Stats (Unfiltered to show overall readiness)
  const highPriorityCount = initialPriorities.filter(p => p.priority === "HIGH").length;
  const reviseCount = initialPriorities.filter(p => p.recommendedAction === "Revise").length;
  // 1. Correct "Strong Topics" calculation
  const readyCount = initialPriorities.filter(p => p.recommendedAction === "Maintain").length;
  // 2. Missing Overall Readiness
  const readiness = initialPriorities.length > 0 
    ? Math.round(initialPriorities.reduce((acc, p) => acc + p.masteryScore, 0) / initialPriorities.length)
    : 0;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDesc ? <ChevronDown className="inline w-3 h-3 ml-1" /> : <ChevronUp className="inline w-3 h-3 ml-1" />;
  };

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden flex">
        <div className={`h-full rounded-full ${getScoreColor(value)}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value}%</span>
    </div>
  );

  if (initialPriorities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
          <Info className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No intelligence yet</h3>
        <p className="text-gray-500 mb-6 max-w-sm">Complete the following to unlock your personalized Topic Intelligence dashboard:</p>
        <div className="flex flex-col gap-3 text-sm text-gray-600 font-medium text-left">
          <div className="flex items-center gap-2"><span className="text-gray-300">✓</span> Practice Session</div>
          <div className="flex items-center gap-2"><span className="text-gray-300">✓</span> Mock Test</div>
          <div className="flex items-center gap-2"><span className="text-gray-300">✓</span> Mistake Log</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 8. Updated Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">High Priority</p>
          <p className="text-3xl font-bold text-red-600">{highPriorityCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Need Revision</p>
          <p className="text-3xl font-bold text-amber-600">{reviseCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Ready Topics</p>
          <p className="text-3xl font-bold text-green-600">{readyCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Topic Readiness</p>
          <p className="text-3xl font-bold text-indigo-600">{readiness}%</p>
        </div>
      </div>

      {/* 9 & 10. Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-1 md:pb-0">
          <select 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">All Subjects</option>
            {Object.keys(SUBJECT_LABELS).map(key => (
              <option key={key} value={key}>{SUBJECT_LABELS[key]}</option>
            ))}
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Main Intelligence Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
              <tr className="text-[11px] uppercase tracking-wider text-gray-500">
                <th className="px-4 py-4 font-semibold text-center w-12">#</th>
                <th className="px-6 py-4 font-semibold">Topic</th>
                <th className="px-4 py-4 font-semibold text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("score")}>
                  Priority {renderSortArrow("score")}
                </th>
                <th className="px-4 py-4 font-semibold w-32 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("knowledgeScore")}>
                  Knowledge {renderSortArrow("knowledgeScore")}
                </th>
                <th className="px-4 py-4 font-semibold w-32 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("speedScore")}>
                  Speed {renderSortArrow("speedScore")}
                </th>
                <th className="px-4 py-4 font-semibold w-32 text-indigo-600 cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => handleSort("masteryScore")}>
                  Mastery {renderSortArrow("masteryScore")}
                </th>
                <th className="px-4 py-4 font-semibold text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("weakMockCount")}>
                  Tags {renderSortArrow("weakMockCount")}
                </th>
                <th className="px-6 py-4 font-semibold text-right">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAndSorted.map((topic, index) => {
                const actionData = ACTION_MAP[topic.recommendedAction];
                const subjectStyle = SUBJECT_COLORS[topic.subject] || "bg-gray-50 text-gray-700 ring-gray-200";
                const rowId = `${topic.subject}-${topic.topic}`;

                return (
                  <tr key={rowId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-center text-xs font-medium text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{topic.topic}</div>
                      {/* 5. Subject Badges */}
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ring-1 ring-inset ${subjectStyle}`}>
                          {SUBJECT_LABELS[topic.subject] || topic.subject}
                        </span>
                      </div>
                    </td>
                    
                    {/* 3. Vertical Priority & 4. Clickable Tooltip Popover */}
                    <td className="px-4 py-4 whitespace-nowrap text-center relative">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-lg font-black text-gray-900 leading-none">{topic.score}</span>
                        <div className="flex items-center gap-1">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${PRIORITY_COLORS[topic.priority]}`}>
                            {topic.priority}
                          </span>
                          {topic.reasons.length > 0 && (
                            <button 
                              onClick={() => setActivePopover(activePopover === rowId ? null : rowId)}
                              className="text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mobile-friendly Popover */}
                      {activePopover === rowId && (
                         <>
                           <div className="fixed inset-0 z-20" onClick={() => setActivePopover(null)} />
                           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-3 px-4 shadow-xl z-30">
                             <p className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">AI Reasoning</p>
                             <ul className="list-disc pl-3 space-y-1.5 text-left">
                               {topic.reasons.map((r, i) => <li key={i}>{r}</li>)}
                             </ul>
                           </div>
                         </>
                      )}
                    </td>

                    {/* 12. Progress Bars */}
                    <td className="px-4 py-4 whitespace-nowrap"><ProgressBar value={topic.knowledgeScore} /></td>
                    <td className="px-4 py-4 whitespace-nowrap"><ProgressBar value={topic.speedScore} /></td>
                    <td className="px-4 py-4 whitespace-nowrap"><ProgressBar value={topic.masteryScore} /></td>

                    {/* 6. Combined Weak/Strong Visuals */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center gap-1 text-xs font-semibold">
                        {topic.weakMockCount > 0 && <div className="text-red-600">🔴 {topic.weakMockCount}</div>}
                        {topic.strongMockCount > 0 && <div className="text-green-600">🟢 {topic.strongMockCount}</div>}
                        {topic.weakMockCount === 0 && topic.strongMockCount === 0 && <span className="text-gray-300">-</span>}
                      </div>
                    </td>

                    {/* 7. Fully Colored Action Pills */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ring-1 ring-inset ${actionData.style}`}>
                        <span>{actionData.icon}</span>
                        {topic.recommendedAction}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}