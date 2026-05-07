import { CircleDot, Clock3, Pause } from "lucide-react";
import {
  findActiveTask,
  findNextTask,
  formatCountdown,
  nowMinutes,
  toMinutes,
} from "../lib/schedule";
import { Card, Pill, ProgressBar } from "./ui";
import { useEffect, useState } from "react";

interface Props {
  isDone: (taskId: string) => boolean;
  onToggle: (taskId: string) => void;
}

export function HeroTask({ isDone, onToggle }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const active = findActiveTask(now);
  const next = findNextTask(now);
  const target = active ?? next;
  const isActive = Boolean(active);

  if (!target) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-muted">
          <Pause className="h-5 w-5" />
          <span>Day complete. Rest up.</span>
        </div>
      </Card>
    );
  }

  const startMin = toMinutes(target.start);
  const endMin = target.end ? toMinutes(target.end) : startMin + 30;
  const nm = nowMinutes(now);
  const progress = isActive ? (nm - startMin) / (endMin - startMin) : 0;
  const countdown = isActive
    ? formatCountdown(endMin, nm)
    : formatCountdown(startMin, nm);
  const done = isDone(target.id);

  return (
    <Card
      className={`relative overflow-hidden p-6 ${
        isActive
          ? "border-accent/50 bg-gradient-to-br from-accent/10 via-panel to-panel animate-pulseGlow"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Pill tone="accent">
                <CircleDot className="h-3 w-3" />
                Now
              </Pill>
            ) : (
              <Pill>
                <Clock3 className="h-3 w-3" />
                Up next
              </Pill>
            )}
            <span className="text-xs uppercase tracking-widest text-muted">
              {target.block}
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {target.label}
          </h2>
          <p className="text-sm text-muted">
            {target.start}
            {target.end ? ` – ${target.end}` : ""} ·{" "}
            {isActive ? `${countdown} left` : `starts in ${countdown}`}
          </p>
        </div>
        <button
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          onClick={() => onToggle(target.id)}
          className={`discipline-check flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-2xl font-bold ${
            done
              ? "border-accent bg-accent text-black animate-pop"
              : "border-edge text-muted hover:border-accent/60 hover:text-accent"
          }`}
        >
          {done ? "✓" : ""}
        </button>
      </div>
      {isActive && (
        <div className="mt-5">
          <ProgressBar ratio={progress} />
        </div>
      )}
    </Card>
  );
}
