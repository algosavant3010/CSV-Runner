"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CSVUploaderProps {
  onUpload: (file: File) => void
}

export function CSVUploader({ onUpload }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }
    setFileName(file.name)
    onUpload(file)
  }

  return (
    <div>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleChange} className="hidden" />

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/30",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {fileName ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">File uploaded: {fileName}</p>
              <Button onClick={() => fileInputRef.current?.click()}>Upload Another</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Drop your CSV file here, or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports CSV files with date, person, and miles columns
              </p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()}>Select File</Button>
          </div>
        )}
      </div>
    </div>
  )
}
