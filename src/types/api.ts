export interface ChatRequest {
  query: string;
}

export interface KPIs {
  total_pipeline_value: number;
  excluded_missing_revenue: number;
  average_deal_size: number;
  top_sector: string | null;
  sector_concentration_pct: number | null;
  realized_revenue: number;
  delay_pct: number;
  forecast_next_90d_revenue: number;
  forecast_next_90d_deals: number;
}

export interface Charts {
  revenue_by_sector: Record<string, number>;
  deal_count_by_stage: Record<string, number>;
  work_order_status: Record<string, number>;
}

export interface TenantContext {
  deals_board_id: string;
  work_orders_board_id: string;
}

export interface ChatResponse {
  request_id: string;
  timestamp_utc: string;
  latency_ms: number;
  intent: "pipeline" | "sector" | "execution" | "assistant" | "general";
  summary: string;
  kpis: KPIs;
  charts: Charts;
  caveats: string[];
  trace: string[];
  tenant_context: TenantContext;
  response: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  apiResponse?: ChatResponse;
}
