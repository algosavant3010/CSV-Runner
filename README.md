# CSV Runner Dashboard

A Next.js web application for uploading, parsing, validating, and visualizing running data from CSV files. Built with Next.js 16, React 19, TypeScript, and shadcn/ui components.

## Project Overview

**Challenge:** CSV Runner Dashboard (Next.js + shadcn/ui)

This project provides a data analytics dashboard for visualizing running data uploaded via CSV files. Users can:
- Upload CSV files containing running data (date, person, miles)
- View overall analytics with aggregate metrics and visualizations
- View per-person analytics with individual runner statistics
- See comprehensive error handling for invalid CSV inputs

## What I Built

The application includes:
- **CSV Upload & Validation**: Drag-and-drop file uploader with comprehensive validation for headers, data types, and format
- **Overall Analytics Dashboard**: Aggregate metrics (total runs, average/min/max miles) and bar chart visualization showing daily miles across all runners
- **Per-Person Dashboard**: Individual runner selection with personal metrics and line chart showing progress over time
- **Error Handling**: Detailed error messages for missing columns, invalid dates, negative miles, and malformed CSV data
- **Professional Dark Theme**: Clean, data-focused UI inspired by analytics platforms

## Assumptions

1. **CSV Format**: The CSV file must have headers in the first row with columns named `date`, `person`, and `miles` (or `miles run`). Header names are case-insensitive.

2. **Date Format**: Dates should be in a format parseable by JavaScript's `Date` constructor (e.g., YYYY-MM-DD, MM/DD/YYYY). Invalid dates will trigger an error.

3. **Miles Value**: Miles must be a non-negative number. Decimal values are supported and rounded to 2 decimal places for display.

4. **Person Names**: Person names are required and case-sensitive (e.g., "John" and "john" are treated as different people).

5. **Empty Lines**: Empty lines in the CSV file are ignored.

6. **Client-Side Processing**: All CSV parsing and validation happens in the browser. No server-side storage is used.

7. **Browser Support**: Modern browsers with ES6+ support are required (Chrome, Firefox, Safari, Edge).

## Prerequisites

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, yarn, pnpm, or bun
- **Browser**: Modern browser with JavaScript enabled

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

This project does not require any environment variables. All processing happens client-side.

### Initial Data

A sample CSV file is included at `public/sample-data.csv` for testing purposes. You can download it from the application and use it to test the upload functionality.

## Run & Verify

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Step-by-Step Verification

#### 1. Upload CSV File

**Test with Sample Data:**
1. Navigate to `http://localhost:3000`
2. Download the sample CSV from `public/sample-data.csv` or create your own with this format:
   ```csv
   date,person,miles
   2024-01-01,John,5.2
   2024-01-02,Sarah,3.8
   2024-01-03,John,6.1
   ```
3. Drag and drop the CSV file into the upload area, or click "Select File" to browse
4. The file should be parsed and you'll be redirected to the Overall Analytics view

**Expected Result:** Successful upload shows the overall dashboard with metrics and charts.

#### 2. Validate Overall Analytics

1. After upload, verify the metrics cards show:
   - **Total Runs**: Count of all running entries
   - **Average Miles**: Mean miles across all runs
   - **Minimum Miles**: Shortest run distance
   - **Maximum Miles**: Longest run distance

2. Verify the bar chart displays:
   - X-axis: Dates with multiple runs aggregated
   - Y-axis: Total miles run on that date
   - Bars should match the data in your CSV

**Expected Result:** Metrics are calculated correctly and chart displays all dates with proper aggregation.

#### 3. Validate Per-Person View

1. Click the "Per-Person View" button in the navigation
2. Select a runner from the dropdown
3. Verify individual metrics display correctly for the selected person
4. Verify the line chart shows that person's running progress over time
5. Switch between different people and confirm data updates

**Expected Result:** Each person's data is isolated correctly with accurate metrics and chronological line chart.

#### 4. Test Error Handling

**Invalid CSV Format:**
Create a file with wrong headers (e.g., `date,name,distance`) and try to upload.

**Expected Result:** Error message: "Missing required columns: date, person, miles (or miles run)"

**Invalid Date:**
Create a CSV with an invalid date (e.g., `notadate,John,5.0`).

**Expected Result:** Error message: "Row 2: Invalid date format 'notadate'"

**Invalid Miles:**
Create a CSV with non-numeric miles (e.g., `2024-01-01,John,abc`).

**Expected Result:** Error message: "Row 2: Invalid miles value 'abc'"

**Negative Miles:**
Create a CSV with negative miles (e.g., `2024-01-01,John,-5.0`).

**Expected Result:** Error message: "Row 2: Invalid miles value '-5.0'"

**Empty CSV:**
Upload an empty CSV or one with only headers.

**Expected Result:** Error message: "CSV file is empty or has no data rows"

#### 5. Upload New File

1. From any dashboard view, click "Upload New File" button in the header
2. Verify you're returned to the upload screen
3. Upload a different CSV file
4. Verify new data replaces old data

**Expected Result:** New file data displays correctly, previous data is cleared.

### Build for Production

```bash
npm run build
npm start
```

Visit `http://localhost:3000` to test the production build.

## Features & Limitations

### Features

- Drag-and-drop CSV file upload with click-to-browse fallback
- Comprehensive CSV validation with detailed error messages
- Real-time data parsing and visualization
- Overall analytics with aggregate metrics and bar chart
- Per-person analytics with individual metrics and line chart
- Responsive design that works on desktop, tablet, and mobile
- Dark theme optimized for data visualization
- Accessible UI with proper ARIA labels and keyboard navigation
- Sample CSV file included for testing

### Limitations

- **No Persistence**: Data is stored in component state only. Refreshing the page will clear uploaded data.
- **File Size**: Large CSV files (>1000 rows) may cause performance issues due to client-side processing.
- **No Data Export**: Currently no way to export processed data or charts.
- **Single File**: Only one CSV file can be loaded at a time. Previous data is overwritten on new upload.
- **Date Grouping**: The overall chart aggregates all runs on the same date. Individual run times within a day are not preserved.
- **Basic Validation**: While comprehensive for the requirements, advanced validation (duplicate detection, outlier detection) is not implemented.

### Future Improvements

- Add data persistence with local storage or database integration
- Implement CSV export functionality
- Add data filtering by date range
- Include more chart types (pie charts, comparison charts)
- Add data editing capabilities
- Implement multiple file comparison
- Add statistical analysis (trends, predictions)
- Include performance optimizations for large datasets

## Notes on Architecture

### Folder Structure

```
csv-runner-dashboard/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx            # Root layout with dark theme
│   └── page.tsx              # Main page with state management
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── csv-uploader.tsx      # Drag-and-drop file uploader
│   ├── overall-dashboard.tsx # Overall analytics view
│   ├── overall-chart.tsx     # Bar chart for overall data
│   ├── person-dashboard.tsx  # Per-person analytics view
│   └── person-chart.tsx      # Line chart for individual runners
├── lib/
│   ├── csv-parser.ts         # CSV parsing and validation logic
│   ├── metrics.ts            # Metrics calculation utilities
│   └── utils.ts              # General utilities (cn function)
└── public/
    └── sample-data.csv       # Sample CSV for testing
```

### Key Components

**app/page.tsx**
- Main application state management
- View routing (upload, overall, per-person)
- Error handling and display
- File upload coordination

**components/csv-uploader.tsx**
- Drag-and-drop file upload interface
- File type validation
- User feedback for file selection

**lib/csv-parser.ts**
- CSV text parsing into structured data
- Header validation
- Data type validation (dates, numbers, strings)
- Comprehensive error messages with row numbers

**lib/metrics.ts**
- Calculates aggregate metrics (average, min, max, total, count)
- Groups data by person for per-person metrics
- Handles empty datasets gracefully

**components/overall-dashboard.tsx & components/person-dashboard.tsx**
- Display metrics in card components
- Coordinate chart rendering
- Handle view switching and person selection

**components/overall-chart.tsx & components/person-chart.tsx**
- Recharts integration for data visualization
- Date aggregation and formatting
- Responsive chart sizing

### State & Data Flow

1. User uploads CSV file via `CSVUploader`
2. File is read as text using `FileReader` API
3. Text is parsed by `parseCSV()` into structured `RunData[]` array
4. Data is validated by `validateCSV()` with detailed error reporting
5. Valid data is stored in React state in `app/page.tsx`
6. State is passed down to dashboard components as props
7. Metrics are calculated on-the-fly from data using `calculateMetrics()`
8. Charts receive processed data and render using Recharts

### Design Decisions

- **Client-Side Processing**: All CSV parsing happens in the browser to avoid server costs and maintain simplicity for this challenge.
- **No External CSV Library**: Custom CSV parser was built to maintain full control over validation and error messages.
- **Recharts for Visualization**: Chosen for its simplicity, React integration, and comprehensive chart options.
- **Component Composition**: Separate components for upload, dashboards, and charts for better maintainability and testability.
- **Inline Metrics Calculation**: Metrics are calculated when needed rather than pre-computed, keeping state minimal.

## Accessibility & UI

### Accessibility Features

- **Semantic HTML**: Proper use of `<header>`, `<main>`, and semantic elements
- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support for file upload and navigation
- **Focus Management**: Visible focus indicators on all interactive elements
- **Color Contrast**: Dark theme maintains WCAG AA contrast ratios
- **Screen Reader Support**: Proper text alternatives for icons and charts
- **Responsive Design**: Works across all device sizes with proper touch targets

### UI Design Principles

**Color Palette (Dark Theme):**
- Background: `oklch(0.12 0 0)` - Deep dark gray
- Card Background: `oklch(0.15 0 0)` - Slightly lighter for cards
- Primary Accent: `oklch(0.6 0.2 264)` - Blue for primary actions
- Chart Colors: Blue, teal, and amber variants for data visualization
- Muted Text: `oklch(0.65 0 0)` - Medium gray for secondary text

**Typography:**
- Sans Font: Geist for clean, modern body text
- Mono Font: Geist Mono for code and CSV examples
- Line Height: 1.5-1.6 for optimal readability
- Font Weights: 400 (regular), 500 (medium), 600 (semibold) for hierarchy

**Spacing & Layout:**
- Consistent spacing scale: 4px base unit (Tailwind's spacing scale)
- Card-based layout with proper padding and margins
- Flexbox for component alignment
- Grid layout for metrics cards (responsive: 1-4 columns)
- Ample whitespace for visual breathing room

**Interactive Elements:**
- Button hover states with opacity changes
- Drag-and-drop visual feedback with border color change
- Smooth transitions for all interactive elements
- Clear active states for navigation buttons

---

**Built with Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, and Recharts**
