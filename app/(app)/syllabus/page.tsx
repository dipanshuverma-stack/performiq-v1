import { auth } from "@/auth";
import { BANKING_SYLLABUS } from "@/config/syllabus"; 

export default async function SyllabusPage() {
  const session = await auth();
  if (!session?.user?.email) return <div className="text-zinc-400 p-6">Unauthorized</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen text-zinc-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">PerformIQ Exam Syllabus</h1>
        <p className="text-zinc-400 mt-1">Track your comprehensive banking assessment modules.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(BANKING_SYLLABUS).map(([subjectKey, topicsArray]) => (
          <div key={subjectKey} className="p-6 bg-zinc-950 rounded-xl shadow-xl border border-zinc-900">
            <h2 className="text-xl font-bold capitalize mb-4 text-zinc-100">
              {subjectKey.toLowerCase().replace("_", " ")}
            </h2>
            
            <div className="space-y-2">
              {/* Fixed: Iterate directly over the deep topic arrays */}
              {Array.isArray(topicsArray) && topicsArray.map((topic: any) => (
                <div 
                  key={topic.id} 
                  className="text-sm text-zinc-300 p-3 bg-zinc-900/50 border border-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  {topic.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}