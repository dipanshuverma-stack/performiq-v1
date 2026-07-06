"use client";

import React from "react";
import { X } from "lucide-react";
import { LAYOUT } from "@/lib/layout-constants";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col shrink-0 bg-sidebar border-r border-border
        transform transition-transform duration-200 ease-in-out md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{ width: LAYOUT.sidebarWidth }}
    >
      <div className="h-16 px-6 border-b border-border flex justify-between items-center shrink-0">
        <SidebarBrand />
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden text-slate-400 hover:text-white transition-colors duration-200 p-2"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <SidebarNav onItemSelect={onClose} />
    </aside>
  );
}