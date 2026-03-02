import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export function CaveatsPanel({ caveats, loading }: { caveats?: string[]; loading: boolean }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (!caveats?.length) return null;

  return (
    <Card className="border-yellow-200 dark:border-yellow-900">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <CardTitle className="text-base">Caveats</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {caveats.map((c, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
              {c}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
