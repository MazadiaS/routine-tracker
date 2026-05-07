export type BlockId = "morning" | "midday" | "evening" | "night";

export type DayType = "odd" | "even" | "sunday";

export type TaskCategory = "job" | "aws" | "lecture" | "meeting" | "prep" | "gym" | "wake" | "rest";

export interface ScheduleTask {
  id: string;
  label: string;
  start: string; // "HH:MM"
  end?: string; // "HH:MM" — optional for instant tasks
  block: BlockId;
  category: TaskCategory;
  hours?: number; // counted toward stats
  oddOnly?: boolean;
  evenOnly?: boolean;
  sundayOnly?: boolean;
}

export interface BlockMeta {
  id: BlockId;
  label: string;
  range: string;
}

export type CompletionMap = Record<string, Record<string, boolean>>;
// CompletionMap[isoDate][taskId] = true

export interface DayStat {
  date: string; // YYYY-MM-DD
  required: number;
  done: number;
  ratio: number; // 0..1
  perfect: boolean;
}

export interface Achievement {
  id: string;
  kind: "perfect-day" | "warrior-week" | "iron-month";
  label: string;
  detail: string;
  date: string; // YYYY-MM-DD anchor
}
