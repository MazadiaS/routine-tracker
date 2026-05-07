import { useCallback, useEffect, useState } from "react";
import {
  loadCompletions,
  resetBlock as resetBlockStorage,
  setCompletion as setCompletionStorage,
} from "../lib/storage";
import type { CompletionMap } from "../lib/types";

export function useCompletions() {
  const [map, setMap] = useState<CompletionMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadCompletions().then((m) => {
      if (cancelled) return;
      setMap(m);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    async (date: string, taskId: string) => {
      const current = map[date]?.[taskId] === true;
      const next = !current;
      setMap((prev) => {
        const copy: CompletionMap = { ...prev, [date]: { ...(prev[date] ?? {}) } };
        if (next) copy[date][taskId] = true;
        else delete copy[date][taskId];
        if (Object.keys(copy[date]).length === 0) delete copy[date];
        return copy;
      });
      await setCompletionStorage(date, taskId, next);
    },
    [map],
  );

  const resetBlock = useCallback(async (date: string, taskIds: string[]) => {
    setMap((prev) => {
      const copy: CompletionMap = { ...prev, [date]: { ...(prev[date] ?? {}) } };
      for (const id of taskIds) delete copy[date][id];
      if (Object.keys(copy[date]).length === 0) delete copy[date];
      return copy;
    });
    await resetBlockStorage(date, taskIds);
  }, []);

  const isDone = useCallback(
    (date: string, taskId: string) => map[date]?.[taskId] === true,
    [map],
  );

  return { map, loading, toggle, resetBlock, isDone };
}
