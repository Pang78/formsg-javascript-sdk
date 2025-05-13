"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
import { Check, Edit, X } from "lucide-react";

export interface SubmissionViewProps {
  submission: {
    id: string;
    formId: string;
    formName: string;
    submissionId: string;
    submittedAt: string;
    data: Record<string, unknown>;
  };
  isEditable?: boolean;
  onUpdate?: (id: string, data: Record<string, unknown>) => Promise<void>;
  className?: string;
}

export function SubmissionView({ 
  submission, 
  isEditable = true,
  onUpdate,
  className 
}: SubmissionViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, unknown>>(submission.data || {});
  const [isLoading, setIsLoading] = useState(false);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'medium' 
    }).format(date);
  };

  const handleSaveEdit = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      await onUpdate(submission.id, editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: unknown) => {
    setEditedData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Submission Data</CardTitle>
        <CardDescription>
          {isEditing ? "Edit the submission data below" : "View the decrypted form data"}
        </CardDescription>
        <div className="absolute top-4 right-4 flex space-x-2">
          {isEditable && (
            isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Form Name</h3>
            <p>{submission.formName}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Submission ID</h3>
            <p className="font-mono text-xs">{submission.submissionId}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
            <p>{formatDate(submission.submittedAt)}</p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-base font-medium mb-4">Form Data</h3>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  {Object.entries(editedData).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium">{key}</label>
                      {typeof value === 'string' && value.length > 100 ? (
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          value={String(value || '')}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {Object.entries(submission.data).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="text-sm font-medium">{key}</h4>
                      {typeof value === 'string' && value.length > 100 ? (
                        <div className="mt-1 whitespace-pre-wrap p-3 bg-muted rounded-md text-sm">
                          {value}
                        </div>
                      ) : Array.isArray(value) ? (
                        <ul className="mt-1 list-disc list-inside pl-2">
                          {value.map((item, i) => (
                            <li key={i} className="text-sm">{String(item)}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1">{String(value)}</p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 