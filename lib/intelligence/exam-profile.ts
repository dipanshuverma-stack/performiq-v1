export type ExamProfile =
  | "SBI_PO_PRELIMS"
  | "SBI_CLERK_PRELIMS"
  | "IBPS_PO_PRELIMS"
  | "RRB_PO_PRELIMS";

export function getExamProfile(exam: { name?: string } | string | null): ExamProfile {
  if (!exam) return "SBI_PO_PRELIMS";

  const name = typeof exam === "string" ? exam : (exam.name ?? "");

  const upperName = name.toUpperCase().trim();

  if (upperName.includes("SBI") && upperName.includes("PO")) {
    return "SBI_PO_PRELIMS";
  }

  if (upperName.includes("SBI") && upperName.includes("CLERK")) {
    return "SBI_CLERK_PRELIMS";
  }

  if (upperName.includes("IBPS") && upperName.includes("PO")) {
    return "IBPS_PO_PRELIMS";
  }

  if (upperName.includes("RRB") && upperName.includes("PO")) {
    return "RRB_PO_PRELIMS";
  }

  return "SBI_PO_PRELIMS"; // default
}