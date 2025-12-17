"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Activity, TrendingUp, Users } from "lucide-react"
import { CSVUploader } from "@/components/csv-uploader"
import { OverallDashboard } from "@/components/overall-dashboard"
import { PersonDashboard } from "@/components/person-dashboard"
import { parseCSV, validateCSV, type RunData } from "@/lib/csv-parser"

export default function Home() {
  const [data, setData] = useState<RunData[]>([])
  const [error, setError] = useState<string>("")
  const [view, setView] = useState<"upload" | "overall" | "person">("upload")

  const handleFileUpload = async (file: File) => {
    setError("")

    try {
      const text = await file.text()
      const parsed = parseCSV(text)
      const validation = validateCSV(parsed)

      if (!validation.valid) {
        setError(validation.error || "Invalid CSV format")
        return
      }

      setData(parsed)
      setView("overall")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file")
    }
  }

  const handleReset = () => {
    setData([])
    setError("")
    setView("upload")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Activity className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Runner Analytics</h1>
                <p className="text-sm text-muted-foreground">Advanced CSV Data Visualization</p>
              </div>
            </div>
            {data.length > 0 && (
              <Button onClick={handleReset} variant="outline" size="sm" className="shadow-sm bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Upload New File
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === "upload" ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Running Data
                </CardTitle>
                <CardDescription>Upload a CSV file with columns: date, person, miles</CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploader onUpload={handleFileUpload} />
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Sample CSV Format</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-muted p-4 text-sm font-mono text-muted-foreground">
                  {`date,person,miles
2024-01-01,Rajesh Kumar,5.2
2024-01-02,Priya Sharma,3.8
2024-01-03,Amit Patel,4.5`}
                </pre>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1 shadow-sm">
              <Button
                variant={view === "overall" ? "default" : "ghost"}
                onClick={() => setView("overall")}
                className="flex-1 gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Overall Analytics
              </Button>
              <Button
                variant={view === "person" ? "default" : "ghost"}
                onClick={() => setView("person")}
                className="flex-1 gap-2"
              >
                <Users className="h-4 w-4" />
                Per-Person View
              </Button>
            </div>

            {view === "overall" && <OverallDashboard data={data} />}
            {view === "person" && <PersonDashboard data={data} />}
          </div>
        )}
      </main>
    </div>
  )
}
