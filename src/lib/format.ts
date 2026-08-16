/**
 * Always formats with a fixed locale so the server (Node's default locale)
 * and client (the visitor's browser locale) render identical digit grouping.
 * Bare `.toLocaleString()` hydration-mismatches whenever those two differ —
 * e.g. en-US groups 4812006 as "4,812,006", en-IN groups it as "48,12,006".
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}
