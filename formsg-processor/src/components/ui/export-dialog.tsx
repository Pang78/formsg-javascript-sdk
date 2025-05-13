"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  onExport: (options: {
    formId: string | "all";
    startDate: string;
    endDate: string;
    format: "json" | "csv" | "xlsx";
    transformations: string[];
  }) => Promise<string | Blob>;
  formOptions: Array<{ id: string; name: string }>;
  onClose: () => void;
  isOpen: boolean;
}

export function ExportDialog({
  onExport,
  formOptions,
  onClose,
  isOpen,
}: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "xlsx">("csv");
  const [selectedForm, setSelectedForm] = useState<string | "all">("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transformations, setTransformations] = useState<string[]>([
    "normalize_phone_numbers",
    "format_dates",
  ]);

  if (!isOpen) return null;

  const toggleTransformation = (transformation: string) => {
    if (transformations.includes(transformation)) {
      setTransformations(transformations.filter(t => t !== transformation));
    } else {
      setTransformations([...transformations, transformation]);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);

    try {
      const result = await onExport({
        formId: selectedForm,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: exportFormat,
        transformations,
      });

      toast.success(`Data exported as ${exportFormat.toUpperCase()}`);

      // Handle the exported data
      if (typeof result === "string") {
        // For string, create a Blob and trigger download
        const blob = new Blob([result], {
          type:
            exportFormat === "json"
              ? "application/json"
              : exportFormat === "csv"
              ? "text/csv"
              : "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `formsg-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (result instanceof Blob) {
        // For Blob, trigger download directly
        const url = URL.createObjectURL(result);
        const a = document.createElement("a");
        a.href = url;
        a.download = `formsg-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      onClose();
    } catch (error) {
      toast.error("Export failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Export Data</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form">Select Form</Label>
            <select
              id="form"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value as "all" | string)}
              disabled={isLoading}
            >
              <option value="all">All Forms</option>
              {formOptions.map(form => (
                <option key={form.id} value={form.id}>{form.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`p-2 border rounded text-center ${exportFormat === 'csv' ? 'border-primary bg-primary/5' : 'border-input'}`}
                onClick={() => setExportFormat('csv')}
                disabled={isLoading}
              >
                CSV
              </button>
              <button
                type="button"
                className={`p-2 border rounded text-center ${exportFormat === 'json' ? 'border-primary bg-primary/5' : 'border-input'}`}
                onClick={() => setExportFormat('json')}
                disabled={isLoading}
              >
                JSON
              </button>
              <button
                type="button"
                className={`p-2 border rounded text-center ${exportFormat === 'xlsx' ? 'border-primary bg-primary/5' : 'border-input'}`}
                onClick={() => setExportFormat('xlsx')}
                disabled={isLoading}
              >
                Excel
              </button>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4 mt-4">
            <Label>Data Transformations</Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="normalize_phone"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={transformations.includes("normalize_phone_numbers")}
                  onChange={() => toggleTransformation("normalize_phone_numbers")}
                  disabled={isLoading}
                />
                <label htmlFor="normalize_phone" className="ml-2 text-sm">
                  Normalize phone numbers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="format_dates"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={transformations.includes("format_dates")}
                  onChange={() => toggleTransformation("format_dates")}
                  disabled={isLoading}
                />
                <label htmlFor="format_dates" className="ml-2 text-sm">
                  Format dates (YYYY-MM-DD)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="trim_whitespace"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={transformations.includes("trim_whitespace")}
                  onChange={() => toggleTransformation("trim_whitespace")}
                  disabled={isLoading}
                />
                <label htmlFor="trim_whitespace" className="ml-2 text-sm">
                  Trim whitespace from text fields
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="clean_emails"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={transformations.includes("clean_emails")}
                  onChange={() => toggleTransformation("clean_emails")}
                  disabled={isLoading}
                />
                <label htmlFor="clean_emails" className="ml-2 text-sm">
                  Clean and validate email addresses
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t p-4 space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              "Exporting..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 