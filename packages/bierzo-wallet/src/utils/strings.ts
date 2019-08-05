export const elipsify = (full: string, maxLength: number): string =>
  full.length <= maxLength ? full : full.slice(0, maxLength - 3) + "...";
