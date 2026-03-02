import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Copy,
  Download,
  Trash2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { sendChatQuery } from "@/lib/api";
import type { ChatMessage, ChatResponse } from "@/types/api";
import { toast } from "sonner";

const SUGGESTED = [
  "Pipeline overview",
  "Top sectors",
  "Deal delays",
  "90-day forecast",
  "Work order status",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewData?: (data: ChatResponse) => void;
}

export function AssistantDrawer({ open, onOpenChange, onNewData }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (query: string) => {
    if (!query.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatQuery(query.trim());
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.response || res.summary,
        timestamp: new Date(),
        apiResponse: res,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      onNewData?.(res);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const exportLatest = () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant" && m.apiResponse);
    if (!last?.apiResponse) {
      toast.error("No response to export");
      return;
    }
    const blob = new Blob([JSON.stringify(last.apiResponse, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bi-response-${last.apiResponse.request_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>BI Assistant</SheetTitle>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={exportLatest} title="Export latest">
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setMessages([])}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ask a question about your monday.com data.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => send(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-2">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <div className="flex items-center gap-1 pt-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(msg.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      {msg.apiResponse?.trace?.length ? (
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronDown className="h-3 w-3" />
                            Trace ({msg.apiResponse.trace.length} steps)
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-2">
                            <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                              {msg.apiResponse.trace.map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ol>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : null}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested chips when there are messages */}
        {messages.length > 0 && !loading && (
          <div className="px-6 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTED.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors text-xs"
                onClick={() => send(s)}
              >
                {s}
              </Badge>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your data..."
              className="min-h-[44px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
