export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function subWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - weeks * 7);
  return d;
}

export function eachDayOfInterval(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endTime = new Date(end);
  endTime.setHours(0, 0, 0, 0);
  while (current <= endTime) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}
