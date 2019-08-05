import { ReadonlyDate } from "readonly-date";

export function formatTime(date: ReadonlyDate): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes > 9 ? minutes : `0${minutes}`} ${ampm}`;
}

export function formatDate(date: ReadonlyDate): string {
  const monthNames: ReadonlyArray<string> = [
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
