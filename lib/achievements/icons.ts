// lib/achievements/icons.ts
import {
  Award,
  BookOpen,
  Brain,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  Coins,
  Crown,
  FileCheck,
  Flame,
  Gem,
  Medal,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

export const ACHIEVEMENT_ICONS = {
  ClipboardCheck,
  CalendarCheck,
  CalendarDays,
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