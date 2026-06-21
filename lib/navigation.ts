import type { LucideIcon } from "lucide-react";
import { 
  LayoutDashboard, BookOpen, CheckSquare, RotateCcw, 
  Timer, GraduationCap, FileWarning,
  TrendingUp, LineChart, User, Settings 
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export type NavigationGroups = NavigationGroup[];

export const navigationGroups: NavigationGroups = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Preparation",
    items: [
      { name: "Syllabus", href: "/syllabus", icon: BookOpen },
      { name: "Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Revision", href: "/revision", icon: RotateCcw },
    ],
  },
  {
    title: "Performance",
    items: [
      { name: "Practice", href: "/practice", icon: Timer },
      { name: "Mock Tests", href: "/mocks", icon: GraduationCap },
      { name: "Mistakes", href: "/mistakes", icon: FileWarning },
    ],
  },
  {
    title: "Insights",
    items: [
      { name: "Progress", href: "/progress", icon: TrendingUp },
      { name: "Analytics", href: "/analytics", icon: LineChart },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
    ],
  },
];