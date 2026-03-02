import { supabase } from "@/integrations/supabase/client";
import type { ChatResponse } from "@/types/api";

export async function sendChatQuery(
  query: string,
  dealsBoardId?: string,
  workOrdersBoardId?: string
): Promise<ChatResponse> {
  const headers: Record<string, string> = {};
  if (dealsBoardId) headers["x-deals-board-id"] = dealsBoardId;
  if (workOrdersBoardId) headers["x-work-orders-board-id"] = workOrdersBoardId;

  const { data, error } = await supabase.functions.invoke("chat", {
    body: { query },
    headers,
  });

  if (error) {
    throw new Error(error.message || "Failed to reach the BI agent");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ChatResponse;
}
