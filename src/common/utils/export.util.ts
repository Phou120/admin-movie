/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param filename - Name of the file to download (without extension)
 * @param headers - Optional array of column headers (uses object keys if not provided)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: (keyof T)[]
): void {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Use provided headers or extract from first data object
  const columns = headers || (Object.keys(data[0]) as (keyof T)[]);

  // Create CSV content
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(columns.map(String).join(","));

  // Add data rows
  for (const row of data) {
    const values = columns.map((column) => {
      const value = row[column];
      // Handle different data types
      if (value === null || value === undefined) {
        return "";
      }
      if (typeof value === "string") {
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = value.replace(/"/g, '""');
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue}"`;
        }
        return stringValue;
      }
      return String(value);
    });
    csvRows.push(values.join(","));
  }

  // Create blob and download
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format a date for export (ISO format)
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export function formatDateForExport(dateString: string | Date): string {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toISOString().split("T")[0];
}
