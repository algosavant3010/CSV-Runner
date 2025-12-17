import type { RunData } from "./csv-parser"

export interface Metrics {
  average: number
  min: number
  max: number
  total: number
  count: number
}

export interface AdvancedMetrics extends Metrics {
  pace: number // average pace in min/mile
  consistency: number // consistency score 0-100
  trend: "improving" | "declining" | "stable"
  weeklyAverage: number
  bestWeek: number
  worstWeek: number
}

export interface PerformancePrediction {
  nextWeekPrediction: number
  nextMonthPrediction: number
  confidence: number
}

export function calculateMetrics(data: RunData[]): Metrics {
  if (data.length === 0) {
    return { average: 0, min: 0, max: 0, total: 0, count: 0 }
  }

  const miles = data.map((d) => d.miles)
  const total = miles.reduce((sum, m) => sum + m, 0)
  const average = total / miles.length
  const min = Math.min(...miles)
  const max = Math.max(...miles)

  return {
    average: Math.round(average * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    total: Math.round(total * 100) / 100,
    count: miles.length,
  }
}

export function calculateAdvancedMetrics(data: RunData[]): AdvancedMetrics {
  const basicMetrics = calculateMetrics(data)

  if (data.length === 0) {
    return {
      ...basicMetrics,
      pace: 0,
      consistency: 0,
      trend: "stable",
      weeklyAverage: 0,
      bestWeek: 0,
      worstWeek: 0,
    }
  }

  // Calculate pace (assuming average time of 30 minutes per run)
  const pace = basicMetrics.average > 0 ? 30 / basicMetrics.average : 0

  const miles = data.map((d) => d.miles)
  const mean = basicMetrics.average
  const variance = miles.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / miles.length
  const stdDev = Math.sqrt(variance)
  const consistency = Math.max(0, Math.min(100, 100 - (stdDev / mean) * 100))

  // Calculate trend
  const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime())
  const halfPoint = Math.floor(sortedData.length / 2)
  const firstHalf = sortedData.slice(0, halfPoint)
  const secondHalf = sortedData.slice(halfPoint)

  const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.miles, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.miles, 0) / secondHalf.length

  let trend: "improving" | "declining" | "stable" = "stable"
  const diff = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

  if (diff > 10) trend = "improving"
  else if (diff < -10) trend = "declining"

  const weeklyData = new Map<string, number>()
  sortedData.forEach((run) => {
    const weekKey = getWeekKey(run.date)
    weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + run.miles)
  })

  const weeklyTotals = Array.from(weeklyData.values())
  const weeklyAverage = weeklyTotals.reduce((sum, total) => sum + total, 0) / weeklyTotals.length
  const bestWeek = Math.max(...weeklyTotals)
  const worstWeek = Math.min(...weeklyTotals)

  return {
    ...basicMetrics,
    pace: Math.round(pace * 100) / 100,
    consistency: Math.round(consistency),
    trend,
    weeklyAverage: Math.round(weeklyAverage * 100) / 100,
    bestWeek: Math.round(bestWeek * 100) / 100,
    worstWeek: Math.round(worstWeek * 100) / 100,
  }
}

export function calculatePerformancePrediction(data: RunData[]): PerformancePrediction {
  if (data.length < 3) {
    return { nextWeekPrediction: 0, nextMonthPrediction: 0, confidence: 0 }
  }

  const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime())
  const recentData = sortedData.slice(-7)
  const recentAvg = recentData.reduce((sum, d) => sum + d.miles, 0) / recentData.length

  // Simple linear regression for trend
  const n = sortedData.length
  const sumX = (n * (n + 1)) / 2
  const sumY = sortedData.reduce((sum, d) => sum + d.miles, 0)
  const sumXY = sortedData.reduce((sum, d, i) => sum + (i + 1) * d.miles, 0)
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const nextWeekPrediction = Math.max(0, intercept + slope * (n + 7))
  const nextMonthPrediction = Math.max(0, intercept + slope * (n + 30))

  // Calculate confidence based on consistency
  const advanced = calculateAdvancedMetrics(data)
  const confidence = advanced.consistency

  return {
    nextWeekPrediction: Math.round(nextWeekPrediction * 100) / 100,
    nextMonthPrediction: Math.round(nextMonthPrediction * 100) / 100,
    confidence: Math.round(confidence),
  }
}

export function calculateMetricsByPerson(data: RunData[]): Map<string, Metrics> {
  const byPerson = new Map<string, RunData[]>()

  for (const row of data) {
    const existing = byPerson.get(row.person) || []
    existing.push(row)
    byPerson.set(row.person, existing)
  }

  const metrics = new Map<string, Metrics>()

  for (const [person, personData] of byPerson.entries()) {
    metrics.set(person, calculateMetrics(personData))
  }

  return metrics
}

export function calculateAdvancedMetricsByPerson(data: RunData[]): Map<string, AdvancedMetrics> {
  const byPerson = new Map<string, RunData[]>()

  for (const row of data) {
    const existing = byPerson.get(row.person) || []
    existing.push(row)
    byPerson.set(row.person, existing)
  }

  const metrics = new Map<string, AdvancedMetrics>()

  for (const [person, personData] of byPerson.entries()) {
    metrics.set(person, calculateAdvancedMetrics(personData))
  }

  return metrics
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const week = getWeekNumber(date)
  return `${year}-W${week}`
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
