import { RepeatType } from "./types";

export const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "DAILY", label: "Daily" },
  { value: "ALTERNATE", label: "Alternate" },
  { value: "EVERY_THREE_DAYS", label: "Every 3 Days" },
  { value: "CUSTOM", label: "Custom" },
];

export const WEEKDAYS = [
  { key: "SUN", label: "S" },
  { key: "MON", label: "M" },
  { key: "TUE", label: "T" },
  { key: "WED", label: "W" },
  { key: "THU", label: "T" },
  { key: "FRI", label: "F" },
  { key: "SAT", label: "S" },
] as const;