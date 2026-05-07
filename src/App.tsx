import { useEffect, useState } from "react";
import { Activity, BarChart3, CalendarDays, History } from "lucide-react";
import { DailyView } from "./views/DailyView";
import { WeeklyView } from "./views/WeeklyView";
import { InsightsView } from "./views/InsightsView";
import { HallOfFameView } from "./views/HallOfFameView";
import { supabaseConfigured } from "./lib/supabase";
import { cn } from "./lib/cn";

type Tab = "daily" | "weekly" | "insights" | "hall";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "daily", label: "Daily", icon: Activity },
  { id: "weekly", label: "Weekly", icon: CalendarDays },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "hall", label: "History", icon: History },
];

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    const saved = localStorage.getItem("discipline.tab") as Tab | null;
    return saved && TABS.some((t) => t.id === saved) ? saved : "daily";
  });

  useEffect(() => {
    localStorage.setItem("discipline.tab", tab);
  }, [tab]);

  return (
    <div className="min-h-svh bg-oled text-ink">
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10 lg:pt-12">
        <Header />
        <main className="mt-8">
          {tab === "daily" && <DailyView />}
          {tab === "weekly" && <WeeklyView />}
          {tab === "insights" && <InsightsView />}
          {tab === "hall" && <HallOfFameView />}
        </main>
      </div>
      <BottomNav active={tab} onSelect={setTab} />
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Routine</h1>
          <p className="text-xs text-muted">Daily schedule</p>
        </div>
      </div>
      <span
        className={cn(
          "rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider",
          supabaseConfigured
            ? "border-accent/40 text-accent bg-accent/10"
            : "border-edge text-muted bg-edge/40",
        )}
        title={
          supabaseConfigured
            ? "Synced to Supabase"
            : "Local only — set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env"
        }
      >
        {supabaseConfigured ? "Cloud sync" : "Local only"}
      </span>
    </header>
  );
}

function BottomNav({
  active,
  onSelect,
}: {
  active: Tab;
  onSelect: (t: Tab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-edge bg-oled/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-stretch px-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors",
                isActive ? "text-accent" : "text-muted hover:text-ink",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive && "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]",
                )}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
