"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { navigationGroups } from "@/lib/navigation";
import { SidebarSection } from "./sidebar-section";
import { SidebarItem } from "./sidebar-item";

interface SidebarNavProps {
  onItemSelect?: () => void;
}

export function SidebarNav({ onItemSelect }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hidden">
      {navigationGroups.map((section) => (
        <SidebarSection key={section.title} title={section.title}>
          {section.items.map((item) => {
            // Check if the current route matches the navigation item
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <SidebarItem
                key={item.href}
                name={item.name}
                href={item.href}
                icon={item.icon}
                isActive={isActive}
                onSelect={onItemSelect}
              />
            );
          })}
        </SidebarSection>
      ))}
    </nav>
  );
}