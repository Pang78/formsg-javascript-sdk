"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, FileJson, FileText } from "lucide-react";
import { toast } from "sonner";

// Sample data - in a real app this would come from an API/database
const DEMO_FORMS = [
  { id: "form1", name: "Customer Feedback" },
  { id: "form2", name: "Job Application" },
];

export default function ExportPage() {
  const [selectedForm, setSelectedForm] = useState<string | "all">("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "xlsx">("csv");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [transformations, setTransformations] = useState<string[]>([
    "normalize_phone_numbers",
    "format_dates",
  ]);

  const handleExport = async () => {
    setIsLoading(true);

    try {
      // In a real app, you would call an API endpoint to handle the export
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Data exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error("Export failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTransformation = (transformation: string) => {
    if (transformations.includes(transformation)) {
      setTransformations(transformations.filter(t => t !== transformation));
    } else {
      setTransformations([...transformations, transformation]);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Export Data</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>
            Configure your export preferences to download form submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="form">Select Form</Label>
            <select
              id="form"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value as "all" | string)}
            >
              <option value="all">All Forms</option>
              {DEMO_FORMS.map(form => (
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="flex space-x-4">
              <div 
                className={`flex-1 flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${exportFormat === 'csv' ? 'border-primary bg-primary/5' : 'border-input'}`}
                onClick={() => setExportFormat('csv')}
              >
                <FileText className="h-8 w-8 mb-2" />
                <span>CSV</span>
              </div>
              <div 
                className={`flex-1 flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${exportFormat === 'json' ? 'border-primary bg-primary/5' : 'border-input'}`}
                onClick={() => setExportFormat('json')}
              >
                <FileJson className="h-8 w-8 mb-2" />
                <span>JSON</span>
              </div>
              <div 
                className={`flex-1 flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${exportFormat === 'xlsx' ? 'border-primary bg-primary/5' : 'border-input'}`}
                onClick={() => setExportFormat('xlsx')}
              >
                <FileSpreadsheet className="h-8 w-8 mb-2" />
                <span>Excel</span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div>
                  <Label>Data Transformations</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="normalize_phone"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={transformations.includes("normalize_phone_numbers")}
                        onChange={() => toggleTransformation("normalize_phone_numbers")}
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
                      />
                      <label htmlFor="clean_emails" className="ml-2 text-sm">
                        Clean and validate email addresses
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExport} disabled={isLoading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Exporting..." : "Export Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 