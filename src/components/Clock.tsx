import { useEffect, useState } from "react";
import { Calendar, Clock as ClockIcon, Flame } from "lucide-react";
import { findNextTask, formatCountdown, nowMinutes, toMinutes } from "../lib/schedule";
import { prettyDate, prettyTime } from "../lib/date";
import { Pill } from "./ui";

export function Clock({ streak }: { streak: number }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = findNextTask(now);
  const countdown = next
    ? formatCountdown(toMinutes(next.start), nowMinutes(now))
    : null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 font-mono text-2xl tabular-nums">
        <ClockIcon className="h-5 w-5 text-muted" />
        {prettyTime(now)}
      </div>
      <span className="hidden text-sm text-muted sm:inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {prettyDate(now)}
      </span>
      {streak > 0 && (
        <Pill tone="accent">
          <Flame className="h-3 w-3" />
          {streak}-day streak
        </Pill>
      )}
      {next && countdown && (
        <span className="text-xs text-muted">
          Next: <span className="text-ink">{next.label}</span> in {countdown}
        </span>
      )}
    </div>
  );
}
