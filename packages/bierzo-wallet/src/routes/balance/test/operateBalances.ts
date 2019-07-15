export const getNoFundsMessage = (h6Elements: Element[]): string => {
  return h6Elements[4].textContent || '';
};
