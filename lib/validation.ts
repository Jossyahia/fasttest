// lib/validation.ts
export function validateParams(param: unknown): string | null {
  if (!param) return null;
  if (typeof param !== "string") return null;
  if (param.length === 0) return null;

  // Add any additional validation specific to your ID format
  // For example, if using UUIDs or specific ID patterns
  return param;
}
