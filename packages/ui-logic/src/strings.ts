/**
 * Ellipsify string in the middle of it. So you can check start and end parts of the long string
 * @param full string to ellipsify
 * @param maxLength must be minimum 4 characters
 */
export function ellipsify(full: string, maxLength: number): string {
  if (maxLength < 5) return "...";
  return full.length <= maxLength ? full : full.slice(0, maxLength - 3) + "...";
}

/**
 * Ellipsify string in the middle of it. So you can check start and end parts of the long string
 * @param full string to ellipsify
 * @param maxLength must be minimum 5 characters
 */
export function ellipsifyMiddle(full: string, maxLength: number): string {
  if (maxLength < 6) return "...";
  if (full.length <= maxLength) return full;

  const middlePosition = Math.floor(maxLength / 2);
  return `${full.slice(0, middlePosition - 2)}...${full.slice((maxLength - middlePosition - 1) * -1)}`;
}
