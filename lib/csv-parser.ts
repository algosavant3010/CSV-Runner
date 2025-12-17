export interface RunData {
  date: Date
  person: string
  miles: number
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function parseCSV(text: string): RunData[] {
  const lines = text.trim().split("\n")

  if (lines.length < 2) {
    throw new Error("CSV file is empty or has no data rows")
  }

  // Parse header
  const header = lines[0]
    .toLowerCase()
    .split(",")
    .map((h) => h.trim())

  // Parse data rows
  const data: RunData[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(",").map((v) => v.trim())

    if (values.length !== header.length) {
      throw new Error(`Row ${i + 1}: Column count mismatch`)
    }

    const dateIdx = header.indexOf("date")
    const personIdx = header.indexOf("person")
    const milesIdx = header.indexOf("miles") !== -1 ? header.indexOf("miles") : header.indexOf("mi")

    if (dateIdx === -1 || personIdx === -1 || milesIdx === -1) {
      throw new Error("Missing required columns: date, person, miles (or mi)")
    }

    const dateStr = values[dateIdx]
    const person = values[personIdx]
    const milesStr = values[milesIdx]

    // Parse date
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw new Error(`Row ${i + 1}: Invalid date format "${dateStr}"`)
    }

    // Parse miles
    const miles = Number.parseFloat(milesStr)
    if (isNaN(miles) || miles < 0) {
      throw new Error(`Row ${i + 1}: Invalid miles value "${milesStr}"`)
    }

    // Validate person
    if (!person || person.length === 0) {
      throw new Error(`Row ${i + 1}: Person name is required`)
    }

    data.push({ date, person, miles })
  }

  return data
}

export function validateCSV(data: RunData[]): ValidationResult {
  if (data.length === 0) {
    return { valid: false, error: "No valid data rows found" }
  }

  // Check for valid data
  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    if (!row.date || isNaN(row.date.getTime())) {
      return { valid: false, error: `Invalid date in row ${i + 1}` }
    }

    if (!row.person || typeof row.person !== "string") {
      return { valid: false, error: `Invalid person name in row ${i + 1}` }
    }

    // Validate miles
    if (typeof row.miles !== "number" || row.miles < 0) {
      return { valid: false, error: `Invalid miles value in row ${i + 1}` }
    }
  }

  return { valid: true }
}
