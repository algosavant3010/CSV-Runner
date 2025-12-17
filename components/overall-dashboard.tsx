"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, TrendingUp, TrendingDown, Target, Zap, Award, Calendar } from "lucide-react"
import { calculateAdvancedMetrics, calculatePerformancePrediction } from "@/lib/metrics"
import type { RunData } from "@/lib/csv-parser"
import { OverallChart } from "@/components/overall-chart"
import { ComparisonChart } from "@/components/comparison-chart"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OverallDashboardProps {
  data: RunData[]
}

export function OverallDashboard({ data }: OverallDashboardProps) {
  const metrics = calculateAdvancedMetrics(data)
  const prediction = calculatePerformancePrediction(data)

  const getTrendColor = () => {
    if (metrics.trend === "improving") return "text-accent"
    if (metrics.trend === "declining") return "text-destructive"
    return "text-muted-foreground"
  }

  const getTrendIcon = () => {
    if (metrics.trend === "improving") return <TrendingUp className="h-4 w-4" />
    if (metrics.trend === "declining") return <TrendingDown className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.count}</div>
            <p className="text-xs text-muted-foreground">{metrics.total.toFixed(1)} total miles</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Distance</CardTitle>
            <Target className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.average.toFixed(2)} miles</div>
            <p className="text-xs text-muted-foreground">per run</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consistency Score</CardTitle>
            <Zap className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.consistency}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.consistency >= 80 ? "Excellent" : metrics.consistency >= 60 ? "Good" : "Improving"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Trend</CardTitle>
            <div className={getTrendColor()}>{getTrendIcon()}</div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${getTrendColor()}`}>{metrics.trend}</div>
            <p className="text-xs text-muted-foreground">based on recent activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <Calendar className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.weeklyAverage.toFixed(1)} miles</div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="text-muted-foreground">
                Best: <span className="font-semibold text-accent">{metrics.bestWeek.toFixed(1)} miles</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance Range</CardTitle>
            <Award className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.min.toFixed(1)} - {metrics.max.toFixed(1)} miles
            </div>
            <p className="text-xs text-muted-foreground">shortest to longest run</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Week Prediction</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{prediction.nextWeekPrediction.toFixed(1)} miles</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {prediction.confidence}% confidence
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Running Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-0">
              <div className="space-y-2 mb-4">
                <CardDescription>Daily miles run across all runners</CardDescription>
              </div>
              <OverallChart data={data} />
            </TabsContent>
            <TabsContent value="comparison" className="mt-0">
              <div className="space-y-2 mb-4">
                <CardDescription>Compare total miles and average per run for each runner</CardDescription>
              </div>
              <ComparisonChart data={data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
