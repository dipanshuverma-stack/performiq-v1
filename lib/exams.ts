export interface BankingExam {
  id: number;
  name: string;
  date: Date;
  active: boolean;
}

export const EXAMS = [
  { value: "SBI_PO", label: "SBI PO" },
  { value: "IBPS_PO", label: "IBPS PO" },
  { value: "RRB_PO", label: "RRB PO" },
  { value: "SBI_CLERK", label: "SBI Clerk" },
  { value: "IBPS_CLERK", label: "IBPS Clerk" },
  { value: "RRB_CLERK", label: "RRB Clerk" },
  { value: "RBI_ASSISTANT", label: "RBI Assistant" },
  { value: "RBI_GRADE_B", label: "RBI Grade B" },
  { value: "NICL_AO", label: "NICL AO" },
  { value: "LIC_AAO", label: "LIC AAO" },
] as const;

export const BANKING_EXAMS: BankingExam[] = [
  {
    id: 1,
    name: "SBI PO Prelims",
    date: new Date("2026-08-01"),
    active: true,
  },
  {
    id: 2,
    name: "IBPS PO Prelims",
    date: new Date("2026-08-17"),
    active: false,
  },
  {
    id: 3,
    name: "SBI PO Mains",
    date: new Date("2026-09-01"),
    active: false,
  },
  {
    id: 4,
    name: "IBPS PO Mains",
    date: new Date("2026-10-12"),
    active: false,
  },
];

