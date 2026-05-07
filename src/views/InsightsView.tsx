import { Briefcase, Calendar, Cloud, TrendingUp } from "lucide-react";
import { useCompletions } from "../hooks/useCompletions";
import { Heatmap } from "../components/Heatmap";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui";
import { rangeStats, streakOfPerfectDays, totalHoursByCategory } from "../lib/stats";
import { addDays, startOfMonth, endOfMonth } from "../lib/date";

export function InsightsView() {
  const { map } = useCompletions();
  const today = new Date();

  const yearStart = addDays(today, -365);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const yearStats = rangeStats(yearStart, today, map);
  const monthStats = rangeStats(monthStart, monthEnd, map);

  const yearPerfect = yearStats.filter((s) => s.perfect).length;
  const monthPerfect = monthStats.filter((s) => s.perfect).length;
  const streak = streakOfPerfectDays(map, today);

  const jobHoursMonth = totalHoursByCategory(monthStart, monthEnd, map, "job");
  const awsHoursMonth = totalHoursByCategory(monthStart, monthEnd, map, "aws");
  const jobHoursYear = totalHoursByCategory(yearStart, today, map, "job");
  const awsHoursYear = totalHoursByCategory(yearStart, today, map, "aws");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<TrendingUp className="h-4 w-4" />}
          label="Run of full days"
          value={`${streak}`}
          unit="days"
        />
        <Stat
          icon={<Calendar className="h-4 w-4" />}
          label="Full days · this month"
          value={`${monthPerfect}`}
          unit={`/ ${monthStats.length}`}
        />
        <Stat
          icon={<Briefcase className="h-4 w-4" />}
          label="Job hours · month"
          value={jobHoursMonth.toFixed(1)}
          unit="h"
          sub={`Year: ${jobHoursYear.toFixed(0)}h`}
        />
        <Stat
          icon={<Cloud className="h-4 w-4" />}
          label="AWS hours · month"
          value={awsHoursMonth.toFixed(1)}
          unit="h"
          sub={`Year: ${awsHoursYear.toFixed(0)}h`}
        />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Activity · 12 months</CardTitle>
            <p className="mt-0.5 text-xs text-muted">
              {yearPerfect} full days in the last year
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <Heatmap map={map} today={today} />
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  unit,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
          {icon}
          {label}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-semibold tabular-nums">{value}</span>
          {unit && <span className="text-sm text-muted">{unit}</span>}
        </div>
        {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
      </CardBody>
    </Card>
  );
}
