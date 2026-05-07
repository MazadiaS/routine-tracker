import { isoDate } from "../lib/date";
import { useCompletions } from "../hooks/useCompletions";
import { BlockChecklist } from "../components/BlockChecklist";
import { HeroTask } from "../components/HeroTask";
import { Clock } from "../components/Clock";
import { dayStat, streakOfPerfectDays } from "../lib/stats";
import { Card, CardBody, ProgressBar } from "../components/ui";
import { CheckCircle2 } from "lucide-react";

export function DailyView() {
  const today = new Date();
  const todayKey = isoDate(today);
  const { isDone, toggle, resetBlock, map } = useCompletions();

  const stat = dayStat(today, map);
  const streak = streakOfPerfectDays(map, today);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Clock streak={streak} />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Today</span>
          <span className="font-mono text-sm tabular-nums">
            {stat.done}/{stat.required}
          </span>
          {stat.perfect && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-accent">
              <CheckCircle2 className="h-3 w-3" />
              Perfect day
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardBody>
          <ProgressBar ratio={stat.ratio} />
        </CardBody>
      </Card>

      <HeroTask
        isDone={(id) => isDone(todayKey, id)}
        onToggle={(id) => toggle(todayKey, id)}
      />

      <BlockChecklist
        date={today}
        isDone={(id) => isDone(todayKey, id)}
        onToggle={(id) => toggle(todayKey, id)}
        onResetBlock={(ids) => resetBlock(todayKey, ids)}
      />
    </div>
  );
}
