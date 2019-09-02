export const displayPeriod = (seconds: number): string => {
  let remainingSeconds = seconds;
  const days = Math.floor(remainingSeconds / (3600 * 24));
  remainingSeconds -= days * 3600 * 24;
  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds -= hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds -= minutes * 60;

  let period = "";
  if (days) period += `${days}d `;
  if (hours) period += `${hours}h `;
  if (minutes) period += `${minutes}m `;
  if (remainingSeconds) period += `${remainingSeconds}s`;

  return period.trim();
};
