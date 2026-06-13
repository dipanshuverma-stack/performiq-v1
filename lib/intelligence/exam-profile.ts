

export function getExamProfile(
  examName: string
) {
  const name = examName.toUpperCase();

  if (
    name.includes("SBI") &&
    name.includes("PO")
  ) {
    return "SBI_PO_PRELIMS";
  }

  if (
    name.includes("SBI") &&
    name.includes("CLERK")
  ) {
    return "SBI_CLERK_PRELIMS";
  }

  return "SBI_PO_PRELIMS";
}