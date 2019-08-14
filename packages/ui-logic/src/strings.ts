export function ellipsify(full: string, maxLength: number): string {
  return full.length <= maxLength ? full : full.slice(0, maxLength - 3) + "...";
}
