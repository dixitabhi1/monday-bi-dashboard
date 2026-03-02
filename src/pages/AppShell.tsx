import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KPICards } from "@/components/KPICards";
import { InsightPanel } from "@/components/InsightPanel";
import { CaveatsPanel } from "@/components/CaveatsPanel";
import { MetaRow } from "@/components/MetaRow";
import { ChartPanel } from "@/components/ChartPanel";
import { AssistantDrawer } from "@/components/AssistantDrawer";
import { useBIData } from "@/hooks/useBIData";
import type { ChatResponse } from "@/types/api";
import {
  BarChart3,
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEFAULT_QUERY = "Give me a full pipeline overview";

const AppShell = () => {
  const navigate = useNavigate();
  const { data, loading, error, query, retry } = useBIData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    query(DEFAULT_QUERY);
  }, [query]);

  const handleNewData = (res: ChatResponse) => {
    // When assistant produces new data we could update, but for now the
    // dashboard uses its own query. This keeps it simple.
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">Monday BI Agent</span>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="hidden sm:block">
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="assistant" className="gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Assistant
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Mobile tabs */}
        <div className="sm:hidden">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-9">
              <TabsTrigger value="dashboard" className="text-xs px-2">Dashboard</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs px-2">Analytics</TabsTrigger>
              <TabsTrigger value="assistant" className="text-xs px-2">Chat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Error banner */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => retry(DEFAULT_QUERY)}
                className="ml-4 gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard tab */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <Button
                size="sm"
                variant="outline"
                onClick={() => query(DEFAULT_QUERY)}
                disabled={loading}
                className="gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>
            <KPICards kpis={data?.kpis} loading={loading && !data} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InsightPanel summary={data?.summary} loading={loading && !data} />
              <CaveatsPanel caveats={data?.caveats} loading={loading && !data} />
            </div>
            <MetaRow data={data ?? undefined} />
          </div>
        )}

        {/* Analytics tab */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <ChartPanel
                title="Revenue by Sector"
                data={data?.charts?.revenue_by_sector}
                loading={loading && !data}
              />
              <ChartPanel
                title="Deal Count by Stage"
                data={data?.charts?.deal_count_by_stage}
                loading={loading && !data}
                allowPie
              />
              <ChartPanel
                title="Work Order Status"
                data={data?.charts?.work_order_status}
                loading={loading && !data}
                allowPie
              />
            </div>
            {!loading && !data && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No data yet. The dashboard will load data automatically.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setTab("dashboard");
                    query(DEFAULT_QUERY);
                  }}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Assistant tab — opens drawer */}
        {tab === "assistant" && (
          <div className="text-center py-20 space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold">BI Assistant</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ask questions about your monday.com data in plain English.
            </p>
            <Button onClick={() => setDrawerOpen(true)} className="gap-2">
              <MessageSquare className="h-4 w-4" /> Open Assistant
            </Button>
          </div>
        )}
      </main>

      {/* Floating chat button */}
      {tab !== "assistant" && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
          onClick={() => setDrawerOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      <AssistantDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onNewData={handleNewData}
      />
    </div>
  );
};

export default AppShell;
