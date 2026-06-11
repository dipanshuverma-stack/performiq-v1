import { appConfig } from "@/lib/app-config";
import { SmartLink as Link } from "@/components/smart-link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#0B0F19] text-xs text-slate-400 font-medium shrink-0 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-bold text-white tracking-tight uppercase text-[12px]">
              {appConfig.name}
            </span>
            <p className="text-slate-500 text-[11px]">Prepare • Analyze • Improve</p>
          </div>
          
          {/* Main Core Tracking Modules Index Map Link Array */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-slate-400 font-semibold">
            <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
            <Link href="/practice" className="hover:text-indigo-400 transition-colors">Practice</Link>
            <Link href="/mocks" className="hover:text-indigo-400 transition-colors">Mocks</Link>
            <Link href="/mistakes" className="hover:text-indigo-400 transition-colors">Mistake Book</Link>
            <Link href="/revision" className="hover:text-indigo-400 transition-colors">Revision</Link>
            <Link href="/analytics" className="hover:text-indigo-400 transition-colors">Analytics</Link>
            <Link href="/profile" className="hover:text-indigo-400 transition-colors">Profile</Link>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 font-normal text-[11px]">
          <p>© {currentYear} PerformIQ Platforms. All rights reserved.</p>
          <p className="font-mono opacity-80">v1.0.0 Stable Engine</p>
        </div>
      </div>
    </footer>
  );
}