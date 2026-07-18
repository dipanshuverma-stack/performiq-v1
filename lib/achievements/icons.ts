// lib/achievements/icons.ts
import {
  ClipboardCheck,
  Calendar,
  CalendarCheck,
  CalendarRange,
  CalendarDays,
  CalendarClock,
  CalendarHeart,
  NotebookPen,
  Landmark,
  RefreshCcw,
  BookOpen,
  Target,
  Brain,
  Flame,
  FileCheck,
  Award,
  Trophy,
  Coins,
  Gem,
  Crown,
  Sparkles,
  Medal,
} from "lucide-react";

export const ACHIEVEMENT_ICONS = {
  ClipboardCheck,
  Calendar,
  CalendarCheck,
  CalendarRange,
  CalendarDays,
  CalendarClock,
  CalendarHeart,
  NotebookPen,
  Landmark,
  RefreshCcw,

  BookOpen,
  Target,
  Brain,
  Flame,
  FileCheck,
  Award,
  Trophy,

  Coins,
  Gem,
  Crown,

  Sparkles,
  Medal,
} as const;

export type AchievementIconKey = keyof typeof ACHIEVEMENT_ICONS;