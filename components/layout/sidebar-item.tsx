"use client";

import React from "react";
import { SmartLink as Link } from "@/components/smart-link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  onSelect?: () => void;
}

export function SidebarItem({ name, href, icon: Icon, isActive, onSelect }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onSelect}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
          isActive
            ? "bg-sidebar-active text-indigo-300"
            : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-100"
        )}
      >
        {/* Active Indicator Line */}
        {isActive && (
          <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-indigo-500 rounded-full" />
        )}
        
        <Icon 
          className={cn(
            "h-4 w-4 shrink-0 transition-colors duration-200",
            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
          )} 
        />
        <span className="truncate">{name}</span>
      </Link>
    </li>
  );
}