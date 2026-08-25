/**
 * Calculates remaining days until a judicial or statutory deadline.
 */
export function getDaysUntilDeadline(dateString: string): number {
  if (!dateString) return 999;
  const target = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a judicial deadline is peremtory (e.g. less than 3 days left).
 */
export function isDeadlinePeremptory(daysLeft: number): boolean {
  return daysLeft <= 3 && daysLeft >= 0;
}
