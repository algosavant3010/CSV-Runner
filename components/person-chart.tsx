"use client"

import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RunData } from "@/lib/csv-parser"

interface PersonChartProps {
  data: RunData[]
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function PersonChart({ data }: PersonChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime())

    const movingAvgWindow = 3
    const result = sorted.map((row, index) => {
      const start = Math.max(0, index - movingAvgWindow + 1)
      const subset = sorted.slice(start, index + 1)
      const avg = subset.reduce((sum, r) => sum + r.miles, 0) / subset.length

      return {
        date: row.date.toISOString().split("T")[0],
        miles: Math.round(row.miles * 100) / 100,
        movingAvg: Math.round(avg * 100) / 100,
        displayDate: row.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }
    })

    return result
  }, [data])

  const weeklyData = useMemo(() => {
    const byWeek = new Map<string, number>()

    for (const row of data) {
      const date = new Date(row.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split("T")[0]

      const existing = byWeek.get(weekKey) || 0
      byWeek.set(weekKey, existing + row.miles)
    }

    return Array.from(byWeek.entries())
      .map(([week, miles]) => ({
        week: new Date(week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        miles: Math.round(miles * 100) / 100,
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
  }, [data])

  if (chartData.length === 0) {
    return <div className="flex h-[350px] items-center justify-center text-muted-foreground">No data to display</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Running Trend</CardTitle>
          <CardDescription>Daily miles with moving average trend line</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              miles: {
                label: "Miles",
                color: "hsl(var(--chart-2))",
              },
              movingAvg: {
                label: "Trend",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorMilesLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  label={{
                    value: "Miles",
                    angle: -90,
                    position: "insideLeft",
                    fill: "hsl(var(--muted-foreground))",
                    style: { fontSize: 12 },
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="miles"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>Miles run per week with colorful visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              miles: {
                label: "Weekly Miles",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis
                  dataKey="week"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  label={{
                    value: "Miles",
                    angle: -90,
                    position: "insideLeft",
                    fill: "hsl(var(--muted-foreground))",
                    style: { fontSize: 12 },
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="miles" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
