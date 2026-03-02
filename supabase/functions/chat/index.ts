const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-deals-board-id, x-work-orders-board-id",
};

const BACKEND_URL = "https://abhishek785-monday-bi-agent.hf.space/chat";
const TIMEOUT_MS = 30_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function forwardRequest(req: Request): Promise<Response> {
  const body = await req.text();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const dealsBoardId = req.headers.get("x-deals-board-id");
  const workOrdersBoardId = req.headers.get("x-work-orders-board-id");
  if (dealsBoardId) headers["x-deals-board-id"] = dealsBoardId;
  if (workOrdersBoardId) headers["x-work-orders-board-id"] = workOrdersBoardId;

  const init: RequestInit = { method: "POST", headers, body };

  // First attempt
  try {
    const res = await fetchWithTimeout(BACKEND_URL, init, TIMEOUT_MS);
    if (res.ok) {
      const data = await res.text();
      return new Response(data, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Non-OK — fall through to retry
  } catch (_) {
    // timeout or network error — fall through to retry
  }

  // Retry once
  try {
    const res = await fetchWithTimeout(BACKEND_URL, init, TIMEOUT_MS);
    const data = await res.text();
    if (res.ok) {
      return new Response(data, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({
        error: "Backend returned an error",
        status: res.status,
        detail: data,
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "AbortError"
        ? "Request to backend timed out after 30 seconds"
        : `Network error: ${String(err)}`;
    return new Response(JSON.stringify({ error: message }), {
      status: 504,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return forwardRequest(req);
});
