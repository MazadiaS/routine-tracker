import { Award, Crown, Shield, Trophy } from "lucide-react";
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
        <Trophy3 icon={<Trophy />} label="Perfect days" value={counts.perfect} accent="from-accent/20" />
        <Trophy3 icon={<Shield />} label="Warrior weeks" value={counts.warrior} accent="from-warn/20" />
        <Trophy3 icon={<Crown />} label="Iron months" value={counts.iron} accent="from-accent/30" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hall of Fame</CardTitle>
          <span className="text-xs text-muted">
            {achievements.length} earned
          </span>
        </CardHeader>
        <CardBody>
          {achievements.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Award className="h-10 w-10 text-muted/50" />
              <p className="text-sm text-muted">
                No badges yet. Complete every task today to earn your first
                Perfect Day.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a) => {
                const tone =
                  a.kind === "iron-month"
                    ? "accent"
                    : a.kind === "warrior-week"
                      ? "warn"
                      : "accent";
                const Icon =
                  a.kind === "iron-month"
                    ? Crown
                    : a.kind === "warrior-week"
                      ? Shield
                      : Trophy;
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
                    className="rounded-2xl border border-edge bg-gradient-to-br from-edge/40 to-panel p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Icon
                        className={`h-7 w-7 ${
                          a.kind === "warrior-week" ? "text-warn" : "text-accent"
                        }`}
                      />
                      <Pill tone={tone}>{a.label}</Pill>
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

function Trophy3({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className={`bg-gradient-to-br ${accent} via-panel to-panel`}>
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
