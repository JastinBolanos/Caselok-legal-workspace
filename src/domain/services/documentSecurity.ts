/**
 * Generates a mock SHA-256 cryptographic hexadecimal digest for digital chain of custody.
 */
export function generateSha256Checksum(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * Returns formatted timestamp for document audit logs.
 */
export function formatAuditTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ').substring(0, 16);
}
