import { addDays, fromIso, isoDate, startOfMonth, startOfWeek } from "./date";
import { tasksFor } from "./schedule";
import type { Achievement, CompletionMap, DayStat } from "./types";

export function dayStat(date: Date, map: CompletionMap): DayStat {
  const tasks = tasksFor(date);
  const key = isoDate(date);
  const done = tasks.filter((t) => map[key]?.[t.id]).length;
  const required = tasks.length;
  const ratio = required === 0 ? 0 : done / required;
  return {
    date: key,
    required,
    done,
    ratio,
    perfect: required > 0 && done === required,
  };
}

export function rangeStats(
  start: Date,
  end: Date,
  map: CompletionMap,
): DayStat[] {
  const out: DayStat[] = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  while (cur <= end) {
    out.push(dayStat(cur, map));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function streakOfPerfectDays(map: CompletionMap, today = new Date()): number {
  let streak = 0;
  const cur = new Date(today);
  cur.setHours(0, 0, 0, 0);
  while (true) {
    const s = dayStat(cur, map);
    if (s.perfect) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function totalHoursByCategory(
  start: Date,
  end: Date,
  map: CompletionMap,
  category: "job" | "aws",
): number {
  let total = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  while (cur <= end) {
    const tasks = tasksFor(cur);
    const key = isoDate(cur);
    for (const t of tasks) {
      if (t.category !== category) continue;
      if (!t.hours) continue;
      if (map[key]?.[t.id]) total += t.hours;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}

// Achievement detection.
// Perfect Day: every required task complete that day.
// Warrior Week: 6/7 perfect days in a Mon-Sun week.
// Iron Month: 25+ perfect days in a calendar month.
export function detectAchievements(map: CompletionMap, today = new Date()): Achievement[] {
  const dates = Object.keys(map).sort();
  if (dates.length === 0) return [];

  const earliest = fromIso(dates[0]);
  const out: Achievement[] = [];

  // Perfect days
  const cur = new Date(earliest);
  cur.setHours(0, 0, 0, 0);
  const stop = new Date(today);
  stop.setHours(0, 0, 0, 0);
  while (cur <= stop) {
    const s = dayStat(cur, map);
    if (s.perfect) {
      out.push({
        id: `perfect-${s.date}`,
        kind: "perfect-day",
        label: "Perfect Day",
        detail: `${s.done}/${s.required} tasks completed`,
        date: s.date,
      });
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Warrior weeks — iterate Mondays from start of earliest week to today
  const weekCursor = startOfWeek(earliest);
  while (weekCursor <= stop) {
    const stats = rangeStats(weekCursor, addDays(weekCursor, 6), map);
    const perfect = stats.filter((s) => s.perfect).length;
    if (perfect >= 6) {
      out.push({
        id: `warrior-${isoDate(weekCursor)}`,
        kind: "warrior-week",
        label: "Warrior Week",
        detail: `${perfect}/7 perfect days`,
        date: isoDate(weekCursor),
      });
    }
    weekCursor.setDate(weekCursor.getDate() + 7);
  }

  // Iron months
  const monthCursor = startOfMonth(earliest);
  while (monthCursor <= stop) {
    const next = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      0,
    );
    const stats = rangeStats(monthCursor, next, map);
    const perfect = stats.filter((s) => s.perfect).length;
    if (perfect >= 25) {
      out.push({
        id: `iron-${isoDate(monthCursor)}`,
        kind: "iron-month",
        label: "Iron Month",
        detail: `${perfect} perfect days`,
        date: isoDate(monthCursor),
      });
    }
    monthCursor.setMonth(monthCursor.getMonth() + 1);
  }

  return out;
}
