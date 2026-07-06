export const widePages = [
  "/dashboard",
  "/analytics",
  "/mocks",
  "/syllabus",
  "/practice",
  "/history",
] as const;

export type WidePagePath = typeof widePages[number];