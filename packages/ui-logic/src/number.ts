export function round(value: number, digits: number): number {
  const scaling = 10 ** digits;
  return Math.round(value * scaling) / scaling;
}
