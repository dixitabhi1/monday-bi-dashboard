import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, BarChart3, MessageSquare, Shield } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">Monday BI Agent</span>
        </div>
        <a
          href="https://abhishek785-monday-bi-agent.hf.space/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          API Docs <ExternalLink className="h-3 w-3" />
        </a>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Monday BI Agent
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Founder-level BI assistant over live{" "}
              <span className="font-medium text-foreground">monday.com</span> data.
              Ask questions in plain English — get KPIs, charts, and insights instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate("/app")} className="gap-2 px-8">
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <a
                href="https://abhishek785-monday-bi-agent.hf.space/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                Open API Docs <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t">
            <div className="space-y-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-medium">Live KPIs & Charts</h3>
              <p className="text-xs text-muted-foreground">Pipeline, revenue, forecasts — all from live board data.</p>
            </div>
            <div className="space-y-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-medium">Natural Language Queries</h3>
              <p className="text-xs text-muted-foreground">Ask questions like you would to a data analyst.</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-5 w-5 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-medium">Secure Proxy</h3>
              <p className="text-xs text-muted-foreground">All requests routed through a server-side proxy.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
        Technical Assignment — Monday BI Agent
      </footer>
    </div>
  );
};

export default Landing;
