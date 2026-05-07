import { RotateCcw } from "lucide-react";
import { BLOCKS, tasksByBlock } from "../lib/schedule";
import type { ScheduleTask } from "../lib/types";
import { Button, Card, CardBody, CardHeader, CardTitle, ProgressBar } from "./ui";

interface Props {
  date: Date;
  isDone: (taskId: string) => boolean;
  onToggle: (taskId: string) => void;
  onResetBlock: (taskIds: string[]) => void;
}

export function BlockChecklist({ date, isDone, onToggle, onResetBlock }: Props) {
  const grouped = tasksByBlock(date);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {BLOCKS.map((block) => {
        const tasks = grouped[block.id];
        if (tasks.length === 0) return null;
        const doneCount = tasks.filter((t) => isDone(t.id)).length;
        const ratio = doneCount / tasks.length;
        return (
          <Card key={block.id}>
            <CardHeader>
              <div>
                <CardTitle>{block.label}</CardTitle>
                <p className="mt-0.5 text-xs text-muted">{block.range}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted">
                  {doneCount}/{tasks.length}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onResetBlock(tasks.map((t) => t.id))}
                  title="Reset this block — start fresh without failing the day"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              <ProgressBar ratio={ratio} className="mb-3" />
              {tasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  done={isDone(t.id)}
                  onToggle={() => onToggle(t.id)}
                />
              ))}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

function TaskRow({
  task,
  done,
  onToggle,
}: {
  task: ScheduleTask;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        done
          ? "border-accent/40 bg-accent/5"
          : "border-edge hover:border-accent/30 hover:bg-edge/40"
      }`}
    >
      <span
        className={`discipline-check flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 ${
          done
            ? "border-accent bg-accent text-black"
            : "border-edge text-transparent"
        }`}
      >
        ✓
      </span>
      <span className="flex-1">
        <span
          className={`block text-sm font-medium ${
            done ? "text-muted line-through" : "text-ink"
          }`}
        >
          {task.label}
        </span>
        <span className="block text-xs text-muted">
          {task.start}
          {task.end ? ` – ${task.end}` : ""}
        </span>
      </span>
    </button>
  );
}
