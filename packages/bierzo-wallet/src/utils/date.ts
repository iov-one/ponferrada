import { ReadonlyDate } from "readonly-date";

export function formatTime(date: ReadonlyDate): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes > 9 ? minutes : `0${minutes}`} ${ampm}`;
}

export function formatDuration(duration: number): string {
  const seconds = duration % 60;
  const totalMinutes = (duration - seconds) / 60;
  const minutes = totalMinutes % 60;
  const totalHours = (totalMinutes - minutes) / 60;
  const hours = totalHours % 24;
  const days = (totalHours - hours) / 24;

  const daysPart = `${days ? `${days}:` : ""}`;
  const hoursPart = `${hours ? `${hours > 9 ? hours : `0${hours}`}:` : ""}`;
  const minutesPart = `${minutes ? `${minutes > 9 ? minutes : `0${minutes}`}:` : ""}`;
  const secondsPart = `${seconds > 9 ? seconds : `0${seconds}`}`;

  return `${daysPart}${hoursPart}${minutesPart}${secondsPart}`;
}

export function formatDate(date: ReadonlyDate): string {
  const monthNames: readonly string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
}
