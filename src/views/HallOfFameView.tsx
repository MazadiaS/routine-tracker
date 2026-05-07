import { Calendar, CheckCheck, CheckCircle2, Inbox } from "lucide-react";
import { useCompletions } from "../hooks/useCompletions";
import { detectAchievements } from "../lib/stats";
import { Card, CardBody, CardHeader, CardTitle, Pill } from "../components/ui";
import { fromIso, prettyDate } from "../lib/date";

export function HallOfFameView() {
  const { map } = useCompletions();
  const achievements = detectAchievements(map).reverse(); // newest first

  const counts = {
    perfect: achievements.filter((a) => a.kind === "perfect-day").length,
    warrior: achievements.filter((a) => a.kind === "warrior-week").length,
    iron: achievements.filter((a) => a.kind === "iron-month").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <CountCard icon={<CheckCircle2 />} label="Full days" value={counts.perfect} />
        <CountCard icon={<CheckCheck />} label="Weeks · 6+ days" value={counts.warrior} />
        <CountCard icon={<Calendar />} label="Months · 25+ days" value={counts.iron} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <span className="text-xs text-muted">{achievements.length} milestones</span>
        </CardHeader>
        <CardBody>
          {achievements.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Inbox className="h-10 w-10 text-muted/50" />
              <p className="text-sm text-muted">
                Nothing yet. Complete every task in a day for it to land here.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a) => {
                const Icon =
                  a.kind === "iron-month"
                    ? Calendar
                    : a.kind === "warrior-week"
                      ? CheckCheck
                      : CheckCircle2;
                const dateLabel =
                  a.kind === "iron-month"
                    ? fromIso(a.date).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })
                    : a.kind === "warrior-week"
                      ? `Week of ${prettyDate(fromIso(a.date))}`
                      : prettyDate(fromIso(a.date));
                return (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-edge bg-panel p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Icon className="h-6 w-6 text-accent" />
                      <Pill tone="accent">{a.label}</Pill>
                    </div>
                    <div className="mt-3 text-sm font-medium">{dateLabel}</div>
                    <div className="text-xs text-muted">{a.detail}</div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function CountCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
          <span className="text-accent">{icon}</span>
          {label}
        </div>
        <div className="mt-2 text-4xl font-semibold tabular-nums">{value}</div>
      </CardBody>
    </Card>
  );
}
