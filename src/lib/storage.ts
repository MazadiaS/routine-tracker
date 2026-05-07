import { supabase, supabaseConfigured } from "./supabase";
import type { CompletionMap } from "./types";

const LS_KEY = "discipline.completions.v1";
const LS_USER_KEY = "discipline.userId.v1";

function readLocal(): CompletionMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CompletionMap;
  } catch {
    return {};
  }
}

function writeLocal(map: CompletionMap): void {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

function localUserId(): string {
  let id = localStorage.getItem(LS_USER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LS_USER_KEY, id);
  }
  return id;
}

export async function loadCompletions(): Promise<CompletionMap> {
  if (!supabaseConfigured || !supabase) return readLocal();
  const userId = localUserId();
  const { data, error } = await supabase
    .from("completions")
    .select("date,task_id,done")
    .eq("user_id", userId);
  if (error) {
    console.warn("Supabase load failed, using local cache", error);
    return readLocal();
  }
  const map: CompletionMap = {};
  for (const row of data ?? []) {
    if (!row.done) continue;
    map[row.date] ??= {};
    map[row.date][row.task_id] = true;
  }
  return map;
}

export async function setCompletion(
  date: string,
  taskId: string,
  done: boolean,
): Promise<void> {
  // Always update the local mirror so reads stay snappy / offline-tolerant.
  const map = readLocal();
  map[date] ??= {};
  if (done) map[date][taskId] = true;
  else delete map[date][taskId];
  if (Object.keys(map[date]).length === 0) delete map[date];
  writeLocal(map);

  if (!supabaseConfigured || !supabase) return;
  const userId = localUserId();
  const { error } = await supabase.from("completions").upsert(
    {
      user_id: userId,
      date,
      task_id: taskId,
      done,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,date,task_id" },
  );
  if (error) console.warn("Supabase upsert failed", error);
}

export async function resetBlock(
  date: string,
  taskIds: string[],
): Promise<void> {
  await Promise.all(taskIds.map((id) => setCompletion(date, id, false)));
}
