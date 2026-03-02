import { useState, useCallback } from "react";
import type { ChatResponse } from "@/types/api";
import { sendChatQuery } from "@/lib/api";

interface BIDataState {
  data: ChatResponse | null;
  loading: boolean;
  error: string | null;
}

export function useBIData() {
  const [state, setState] = useState<BIDataState>({
    data: null,
    loading: false,
    error: null,
  });

  const query = useCallback(async (q: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await sendChatQuery(q);
      setState({ data: res, loading: false, error: null });
      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState((prev) => ({
        data: prev.data, // preserve last successful
        loading: false,
        error: message,
      }));
      return null;
    }
  }, []);

  const retry = useCallback(
    (q: string) => query(q),
    [query]
  );

  return { ...state, query, retry };
}
