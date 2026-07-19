/**
 * Standardized currency formatter for the PerformIQ ecosystem.
 * Enforces correct Indian Rupee formatting with automatic rounding.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}