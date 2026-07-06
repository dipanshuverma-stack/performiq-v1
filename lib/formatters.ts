export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "??";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}