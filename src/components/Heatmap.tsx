import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { addDays, fromIso, isoDate } from "../lib/date";
import { rangeStats } from "../lib/stats";
import type { CompletionMap } from "../lib/types";
import { useMemo } from "react";

interface Props {
  map: CompletionMap;
  today?: Date;
}

export function Heatmap({ map, today = new Date() }: Props) {
  const startDate = useMemo(() => addDays(today, -365), [today]);
  const endDate = today;

  const stats = useMemo(
    () => rangeStats(startDate, endDate, map),
    [startDate, endDate, map],
  );
  const byDate = useMemo(() => {
    const m = new Map<string, (typeof stats)[number]>();
    for (const s of stats) m.set(s.date, s);
    return m;
  }, [stats]);

  const values = stats.map((s) => ({
    date: s.date,
    count: Math.round(s.ratio * 100),
  }));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          gutterSize={3}
          showWeekdayLabels
          classForValue={(v) => {
            if (!v || !v.date) return "color-empty";
            const s = byDate.get(typeof v.date === "string" ? v.date : isoDate(fromIso(v.date as unknown as string)));
            if (!s || s.required === 0) return "color-empty";
            if (s.perfect) return "color-perfect";
            if (s.ratio >= 0.5) return "color-scale-2";
            if (s.ratio > 0) return "color-scale-1";
            return "color-empty";
          }}
          titleForValue={(v) => {
            if (!v || !v.date) return "";
            const dateStr = typeof v.date === "string" ? v.date : isoDate(fromIso(v.date as unknown as string));
            const s = byDate.get(dateStr);
            if (!s || s.required === 0) return `${dateStr}: rest`;
            if (s.perfect) return `${dateStr}: ${s.done}/${s.required} — all done`;
            return `${dateStr}: ${s.done}/${s.required} tasks done`;
          }}
        />
      </div>
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted">
      <span>Less</span>
      <span className="h-3 w-3 rounded-sm bg-[#161616] border border-edge" />
      <span className="h-3 w-3 rounded-sm bg-accentLow" />
      <span className="h-3 w-3 rounded-sm bg-accentMid" />
      <span className="h-3 w-3 rounded-sm bg-accent" />
      <span>All done</span>
    </div>
  );
}
