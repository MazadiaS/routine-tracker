import type { BlockId, BlockMeta, DayType, ScheduleTask } from "./types";

export const BLOCKS: BlockMeta[] = [
  { id: "morning", label: "Morning", range: "05:30 – 09:00" },
  { id: "midday", label: "Mid-Day", range: "10:00 – 13:00" },
  { id: "evening", label: "Evening", range: "14:00 – 18:00" },
  { id: "night", label: "Night", range: "18:00 – 19:30" },
];

// Master schedule. Tasks marked oddOnly/evenOnly/sundayOnly are filtered per day type.
// Sunday is rest mode — only the Wake Up + Rest task is required.
export const SCHEDULE: ScheduleTask[] = [
  // Morning
  {
    id: "wake",
    label: "Wake Up",
    start: "05:30",
    block: "morning",
    category: "wake",
  },
  {
    id: "job-am",
    label: "Remote Job",
    start: "06:00",
    end: "09:00",
    block: "morning",
    category: "job",
    hours: 3,
  },
  // Mid-day
  {
    id: "team-meeting",
    label: "Team Meeting",
    start: "10:00",
    block: "midday",
    category: "meeting",
  },
  {
    id: "aws-burst-1",
    label: "AWS Burst 1",
    start: "10:20",
    block: "midday",
    category: "aws",
    hours: 0.5,
  },
  {
    id: "lecture-1",
    label: "Lecture 1",
    start: "11:00",
    end: "13:00",
    block: "midday",
    category: "lecture",
  },
  // Evening
  {
    id: "job-pm",
    label: "Remote Job",
    start: "14:00",
    end: "15:00",
    block: "evening",
    category: "job",
    hours: 1,
  },
  {
    id: "lecture-2",
    label: "Lecture 2",
    start: "15:00",
    end: "17:00",
    block: "evening",
    category: "lecture",
  },
  {
    id: "aws-burst-2",
    label: "AWS Burst 2",
    start: "17:00",
    end: "18:00",
    block: "evening",
    category: "aws",
    hours: 1,
  },
  // Night — odd vs even split
  {
    id: "mentor-prep",
    label: "Mentor Prep",
    start: "18:00",
    end: "19:30",
    block: "night",
    category: "prep",
    oddOnly: true,
  },
  {
    id: "gym",
    label: "Gym",
    start: "18:00",
    end: "19:30",
    block: "night",
    category: "gym",
    evenOnly: true,
  },
  // Sunday rest
  {
    id: "rest-sunday",
    label: "Rest & Recover",
    start: "08:00",
    block: "morning",
    category: "rest",
    sundayOnly: true,
  },
];

export function dayTypeFor(date: Date): DayType {
  const dow = date.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  if (dow === 0) return "sunday";
  // Mon, Wed, Fri = odd (mentor prep); Tue, Thu, Sat = even (gym)
  if (dow === 1 || dow === 3 || dow === 5) return "odd";
  return "even";
}

export function tasksFor(date: Date): ScheduleTask[] {
  const t = dayTypeFor(date);
  if (t === "sunday") {
    return SCHEDULE.filter((x) => x.sundayOnly);
  }
  return SCHEDULE.filter((task) => {
    if (task.sundayOnly) return false;
    if (task.oddOnly && t !== "odd") return false;
    if (task.evenOnly && t !== "even") return false;
    return true;
  });
}

export function tasksByBlock(date: Date): Record<BlockId, ScheduleTask[]> {
  const grouped: Record<BlockId, ScheduleTask[]> = {
    morning: [],
    midday: [],
    evening: [],
    night: [],
  };
  for (const task of tasksFor(date)) {
    grouped[task.block].push(task);
  }
  return grouped;
}

// "HH:MM" -> minutes since midnight
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function nowMinutes(d = new Date()): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function findActiveTask(date: Date): ScheduleTask | null {
  const tasks = tasksFor(date);
  const now = nowMinutes(date);
  // Active = a task whose [start, end) covers now. If no end, treat as 30min slot.
  for (const t of tasks) {
    const start = toMinutes(t.start);
    const end = t.end ? toMinutes(t.end) : start + 30;
    if (now >= start && now < end) return t;
  }
  return null;
}

export function findNextTask(date: Date): ScheduleTask | null {
  const tasks = tasksFor(date)
    .slice()
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  const now = nowMinutes(date);
  for (const t of tasks) {
    if (toMinutes(t.start) > now) return t;
  }
  return null;
}

export function formatCountdown(targetMinutes: number, nowMin: number): string {
  let diff = targetMinutes - nowMin;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  return `${m}m`;
}
