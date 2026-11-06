/**
 * Utility functions to safeguard frontend calculations and formatting
 * against null, undefined, NaN, Infinity, and invalid dates from Firestore.
 */

/**
 * Safely parse any value into a finite number.
 * Returns `fallback` (default 0) if value is null, undefined, NaN, or non-finite.
 */
export function safeNum(value: unknown, fallback: number = 0): number {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Safely divide two numbers, returning `fallback` (default 0) if denominator is zero or result is non-finite.
 */
export function safeDivide(numerator: unknown, denominator: unknown, fallback: number = 0): number {
  const num = safeNum(numerator, 0);
  const den = safeNum(denominator, 0);
  if (den === 0) return fallback;
  const result = num / den;
  return Number.isFinite(result) ? result : fallback;
}

/**
 * Safely calculate a percentage (numerator / denominator * 100).
 * Handles zero-division, non-finite values, and optionally clamps to [min, max].
 */
export function safePercent(
  numerator: unknown,
  denominator: unknown,
  clampMin: number = 0,
  clampMax: number = 100
): number {
  const num = safeNum(numerator, 0);
  const den = safeNum(denominator, 0);
  if (den === 0) return clampMin;
  const rawPercent = (num / den) * 100;
  if (!Number.isFinite(rawPercent)) return clampMin;
  return Math.min(Math.max(rawPercent, clampMin), clampMax);
}

/**
 * Safely converts Firestore timestamps, Date objects, numeric timestamps,
 * or date strings into a valid JavaScript Date.
 */
export function safeDate(value: unknown, fallback: Date = new Date()): Date {
  if (!value) return fallback;

  // Handle Firestore Timestamp (has .toDate() method or seconds/nanoseconds)
  if (typeof (value as any)?.toDate === "function") {
    try {
      const d = (value as any).toDate();
      if (d instanceof Date && !Number.isNaN(d.getTime())) return d;
    } catch {
      // fallback below
    }
  }

  if (typeof (value as any)?.seconds === "number") {
    const d = new Date((value as any).seconds * 1000);
    if (!Number.isNaN(d.getTime())) return d;
  }

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime()) ? value : fallback;
  }

  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }

  return fallback;
}

/**
 * Safely formats a number or string amount as South African Rand (e.g. "R 1,250.00").
 * Defaults to "R 0.00" if input is missing or NaN.
 */
export function formatRand(amount: unknown, decimals: number = 2): string {
  const num = safeNum(amount, 0);
  return `R ${num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
