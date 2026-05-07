import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useCompletions } from "../hooks/useCompletions";
import { addDays, isoDate, prettyDate, startOfWeek } from "../lib/date";
import { tasksFor } from "../lib/schedule";
import { Button, Card, CardBody, CardHeader, CardTitle, Pill, ProgressBar } from "../components/ui";
import { dayStat } from "../lib/stats";

export function WeeklyView() {
  const { map, isDone, toggle } = useCompletions();
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()));
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(anchor, i)),
    [anchor],
  );

  const allTaskIds = Array.from(
    new Set(days.flatMap((d) => tasksFor(d).map((t) => t.id))),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Week of {prettyDate(anchor)}</CardTitle>
            <p className="mt-0.5 text-xs text-muted">
              {prettyDate(addDays(anchor, 6))}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setAnchor(addDays(anchor, -7))}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAnchor(startOfWeek(new Date()))}>
              This week
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAnchor(addDays(anchor, 7))}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const s = dayStat(d, map);
              return (
                <div key={isoDate(d)} className="rounded-xl border border-edge p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted">
                    {d.toLocaleDateString(undefined, { weekday: "short" })}
                  </div>
                  <div className="mt-0.5 text-lg font-semibold">{d.getDate()}</div>
                  <div className="mt-2 text-xs text-muted">
                    {s.done}/{s.required}
                  </div>
                  <div className="mt-2">
                    <ProgressBar ratio={s.ratio} />
                  </div>
                  {s.perfect && (
                    <div className="mt-2">
                      <Pill tone="accent">All done</Pill>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task grid</CardTitle>
          <span className="text-xs text-muted">Tap to toggle completion</span>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted">
                <th className="pb-2 pr-3 font-medium">Task</th>
                {days.map((d) => (
                  <th key={isoDate(d)} className="pb-2 px-1 font-medium text-center">
                    {d.toLocaleDateString(undefined, { weekday: "short" })}
                    <div className="text-[10px] text-muted/70">{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTaskIds.map((taskId) => {
                const sample = days
                  .flatMap((d) => tasksFor(d))
                  .find((t) => t.id === taskId);
                if (!sample) return null;
                return (
                  <tr key={taskId} className="border-t border-edge">
                    <td className="py-2 pr-3 align-middle">
                      <div className="font-medium">{sample.label}</div>
                      <div className="text-xs text-muted">
                        {sample.start}
                        {sample.end ? ` – ${sample.end}` : ""}
                      </div>
                    </td>
                    {days.map((d) => {
                      const dayTasks = tasksFor(d);
                      const has = dayTasks.some((t) => t.id === taskId);
                      const key = isoDate(d);
                      const done = has && isDone(key, taskId);
                      return (
                        <td key={key} className="py-2 px-1 text-center align-middle">
                          {has ? (
                            <button
                              aria-label={done ? "Mark incomplete" : "Mark complete"}
                              onClick={() => toggle(key, taskId)}
                              className={`discipline-check mx-auto flex h-7 w-7 items-center justify-center rounded-lg border-2 ${
                                done
                                  ? "border-accent bg-accent text-black"
                                  : "border-edge text-transparent hover:border-accent/40"
                              }`}
                            >
                              ✓
                            </button>
                          ) : (
                            <span className="text-muted/40">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
