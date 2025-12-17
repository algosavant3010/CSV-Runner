"use client"

import { useMemo } from "react"
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RunData } from "@/lib/csv-parser"

interface OverallChartProps {
  data: RunData[]
}

export function OverallChart({ data }: OverallChartProps) {
  const chartData = useMemo(() => {
    const byDate = new Map<string, number>()

    for (const row of data) {
      const dateStr = row.date.toISOString().split("T")[0]
      const existing = byDate.get(dateStr) || 0
      byDate.set(dateStr, existing + row.miles)
    }

    const result = Array.from(byDate.entries())
      .map(([date, miles]) => ({
        date,
        miles: Math.round(miles * 100) / 100,
        displayDate: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return result
  }, [data])

  const personData = useMemo(() => {
    const byPerson = new Map<string, number>()

    for (const row of data) {
      const existing = byPerson.get(row.person) || 0
      byPerson.set(row.person, existing + row.miles)
    }

    return Array.from(byPerson.entries())
      .map(([person, miles]) => ({
        person,
        miles: Math.round(miles * 100) / 100,
      }))
      .sort((a, b) => b.miles - a.miles)
  }, [data])

  if (chartData.length === 0) {
    return <div className="flex h-[350px] items-center justify-center text-muted-foreground">No data to display</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Running Activity</CardTitle>
          <CardDescription>Total miles run each day across all runners</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              miles: {
                label: "Miles",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="miles"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fill="url(#colorMiles)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Runner Comparison</CardTitle>
          <CardDescription>Total miles run by each person</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              miles: {
                label: "Total Miles",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personData}>
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                  </linearGradient>
                  <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-3))" />
                  </linearGradient>
                  <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-4))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis
                  dataKey="person"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  label={{
                    value: "Total Miles",
                    angle: -90,
                    position: "insideLeft",
                    fill: "hsl(var(--muted-foreground))",
                    style: { fontSize: 12 },
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="miles"
                  fill="url(#barGradient1)"
                  radius={[8, 8, 0, 0]}
                  className="transition-opacity hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
