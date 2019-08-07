export const ellipsify = (full: string, maxLength: number): string =>
  full.length <= maxLength ? full : full.slice(0, maxLength - 3) + "...";
