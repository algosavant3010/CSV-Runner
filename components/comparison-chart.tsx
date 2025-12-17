"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { calculateAdvancedMetricsByPerson } from "@/lib/metrics"
import type { RunData } from "@/lib/csv-parser"

interface ComparisonChartProps {
  data: RunData[]
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const metricsByPerson = calculateAdvancedMetricsByPerson(data)

  const chartData = Array.from(metricsByPerson.entries()).map(([person, metrics]) => ({
    person,
    totalMiles: Number(metrics.total.toFixed(1)),
    avgPerRun: Number(metrics.average.toFixed(2)),
  }))

  return (
    <ChartContainer
      config={{
        totalMiles: {
          label: "Total Miles",
          color: "hsl(174, 72%, 56%)",
        },
        avgPerRun: {
          label: "Avg per Run",
          color: "hsl(174, 72%, 76%)",
        },
      }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `${value} mi`}
          />
          <YAxis
            dataKey="person"
            type="category"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            width={70}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted) / 0.1)" }} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="square" />
          <Bar dataKey="totalMiles" fill="hsl(174, 72%, 56%)" radius={[0, 4, 4, 0]} name="Total Miles" />
          <Bar dataKey="avgPerRun" fill="hsl(174, 72%, 76%)" radius={[0, 4, 4, 0]} name="Avg per Run" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
