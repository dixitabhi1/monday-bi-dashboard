import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";

const COLORS = [
  "hsl(222, 47%, 31%)",
  "hsl(215, 20%, 55%)",
  "hsl(210, 40%, 70%)",
  "hsl(200, 30%, 45%)",
  "hsl(180, 25%, 50%)",
  "hsl(160, 20%, 55%)",
  "hsl(140, 15%, 60%)",
  "hsl(120, 10%, 65%)",
];

interface Props {
  title: string;
  data: Record<string, number> | undefined;
  loading: boolean;
  allowPie?: boolean;
}

export function ChartPanel({ title, data, loading, allowPie = false }: Props) {
  const [mode, setMode] = useState<"bar" | "pie">("bar");

  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-52 w-full" /></CardContent>
      </Card>
    );
  }

  const entries = data ? Object.entries(data).map(([name, value]) => ({ name, value })) : [];

  if (!entries.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
        <CardContent>
          <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {allowPie && (
          <div className="flex gap-1">
            <Button
              size="icon"
              variant={mode === "bar" ? "secondary" : "ghost"}
              className="h-7 w-7"
              onClick={() => setMode("bar")}
            >
              <BarChart3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant={mode === "pie" ? "secondary" : "ghost"}
              className="h-7 w-7"
              onClick={() => setMode("pie")}
            >
              <PieIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {mode === "bar" ? (
              <BarChart data={entries} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(222, 47%, 31%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={entries}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {entries.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
