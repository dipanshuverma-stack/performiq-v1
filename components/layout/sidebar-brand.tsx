import React from "react";
import { appConfig } from "@/lib/app-config";

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
      <span className="text-xl font-bold tracking-tight text-white select-none">
        {appConfig.name}
      </span>
    </div>
  );
}