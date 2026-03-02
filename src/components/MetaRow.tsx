import type { ChatResponse } from "@/types/api";
import { Badge } from "@/components/ui/badge";

export function MetaRow({ data }: { data?: ChatResponse }) {
  if (!data) return null;

  const items = [
    { label: "Request", value: data.request_id },
    { label: "Latency", value: `${data.latency_ms}ms` },
    { label: "Timestamp", value: data.timestamp_utc },
    { label: "Intent", value: data.intent },
    { label: "Deals Board", value: data.tenant_context?.deals_board_id },
    { label: "WO Board", value: data.tenant_context?.work_orders_board_id },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground py-3 px-1">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
            {item.label}
          </Badge>
          <span className="font-mono">{item.value ?? "—"}</span>
        </span>
      ))}
    </div>
  );
}
