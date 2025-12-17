"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, TrendingUp, TrendingDown, Target, Zap, Calendar, Award } from "lucide-react"
import { calculateAdvancedMetricsByPerson, calculatePerformancePrediction } from "@/lib/metrics"
import type { RunData } from "@/lib/csv-parser"
import { PersonChart } from "@/components/person-chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PersonDashboardProps {
  data: RunData[]
}

export function PersonDashboard({ data }: PersonDashboardProps) {
  const metricsByPerson = calculateAdvancedMetricsByPerson(data)
  const people = Array.from(metricsByPerson.keys()).sort()
  const [selectedPerson, setSelectedPerson] = useState<string>(people[0] || "")

  const metrics = metricsByPerson.get(selectedPerson)
  const personData = data.filter((d) => d.person === selectedPerson)
  const prediction = calculatePerformancePrediction(personData)

  if (people.length === 0 || !metrics) {
    return <div className="text-center text-muted-foreground">No data available</div>
  }

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
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Select Runner</CardTitle>
          <CardDescription>View individual statistics and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPerson} onValueChange={setSelectedPerson}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {people.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

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
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            <Zap className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.consistency}%</div>
            <Progress value={metrics.consistency} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <div className={getTrendColor()}>{getTrendIcon()}</div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${getTrendColor()}`}>{metrics.trend}</div>
            <p className="text-xs text-muted-foreground">performance trajectory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-chart-4" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weekly Average</span>
              <span className="text-lg font-bold text-foreground">{metrics.weeklyAverage.toFixed(1)} miles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Week</span>
              <span className="text-lg font-semibold text-accent">{metrics.bestWeek.toFixed(1)} miles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Worst Week</span>
              <span className="text-lg font-semibold text-muted-foreground">{metrics.worstWeek.toFixed(1)} miles</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-chart-5" />
              Distance Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Longest Run</span>
              <span className="text-lg font-bold text-accent">{metrics.max.toFixed(2)} miles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Shortest Run</span>
              <span className="text-lg font-semibold text-foreground">{metrics.min.toFixed(2)} miles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Distance</span>
              <span className="text-lg font-bold text-primary">{metrics.total.toFixed(1)} miles</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Performance Predictions
          </CardTitle>
          <CardDescription>AI-powered forecasting based on your running patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Week</p>
              <p className="text-2xl font-bold text-foreground">{prediction.nextWeekPrediction.toFixed(1)} miles</p>
            </div>
            <Badge variant="secondary">{prediction.confidence}% confident</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Month</p>
              <p className="text-2xl font-bold text-foreground">{prediction.nextMonthPrediction.toFixed(1)} miles</p>
            </div>
            <Badge variant="secondary">{Math.round(prediction.confidence * 0.85)}% confident</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{selectedPerson}'s Running Progress</CardTitle>
          <CardDescription>Daily miles run over time</CardDescription>
        </CardHeader>
        <CardContent>
          <PersonChart data={personData} />
        </CardContent>
      </Card>
    </div>
  )
}
