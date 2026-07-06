export const appConfig = {
  name: "PerformIQ",
  version: "v1.0",
  description: "Banking Exam Preparation OS",
  tagline: "Master Bank Exam with AI-powered insights and smart revision",
  defaultExam: "SBI_PO_PRELIMS",
} as const;

export type AppConfig = typeof appConfig;