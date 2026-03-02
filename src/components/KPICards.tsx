import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { KPIs } from "@/types/api";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BadgeDollarSign,
  Clock,
  CalendarDays,
  Hash,
} from "lucide-react";

function fmt(n: number | null | undefined, style: "currency" | "percent" | "number" = "number"): string {
  if (n == null) return "N/A";
  if (style === "currency") {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toLocaleString()}`;
  }
  if (style === "percent") return `${n.toFixed(1)}%`;
  return n.toLocaleString();
}

const cards = [
  { key: "total_pipeline_value" as const, label: "Total Pipeline Value", icon: DollarSign, style: "currency" as const },
  { key: "average_deal_size" as const, label: "Avg Deal Size", icon: TrendingUp, style: "currency" as const },
  { key: "top_sector" as const, label: "Top Sector", icon: PieChart, style: "number" as const },
  { key: "realized_revenue" as const, label: "Realized Revenue", icon: BadgeDollarSign, style: "currency" as const },
  { key: "delay_pct" as const, label: "Delay %", icon: Clock, style: "percent" as const },
  { key: "forecast_next_90d_revenue" as const, label: "90-Day Forecast Revenue", icon: CalendarDays, style: "currency" as const },
  { key: "forecast_next_90d_deals" as const, label: "90-Day Forecast Deals", icon: Hash, style: "number" as const },
];

export function KPICards({ kpis, loading }: { kpis?: KPIs; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {cards.map((c) => (
          <Card key={c.key}>
            <CardHeader className="pb-2 space-y-0">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        let value: string;
        if (c.key === "top_sector") {
          const sector = kpis?.top_sector ?? "N/A";
          const conc = kpis?.sector_concentration_pct;
          value = conc != null ? `${sector} (${conc.toFixed(0)}%)` : sector;
        } else {
          value = fmt(kpis?.[c.key] as number, c.style);
        }
        return (
          <Card key={c.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate" title={value}>
                {value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
