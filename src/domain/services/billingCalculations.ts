import { TimeEntry } from '../models/timeEntry';

/**
 * Calculates billable amount from seconds and hourly rate.
 */
export function calculateBillableAmount(durationSeconds: number, hourlyRate: number): number {
  const hours = durationSeconds / 3600;
  return Number((hours * hourlyRate).toFixed(2));
}

/**
 * Formats a duration in seconds into HH:MM:SS format.
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

/**
 * Computes total billable sum from time entries.
 */
export function computeTotalBilled(entries: TimeEntry[]): number {
  return entries.reduce((acc, curr) => acc + (curr.billableAmount || 0), 0);
}

/**
 * Computes pending/uninvoiced total from time entries.
 */
export function computeUnbilledTotal(entries: TimeEntry[]): number {
  return entries
    .filter(e => !e.invoiced)
    .reduce((acc, curr) => acc + (curr.billableAmount || 0), 0);
}
