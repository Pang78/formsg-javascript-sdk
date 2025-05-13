"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Download, Edit, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

// In the actual implementation, this would be fetched from the API
import { submissionService } from "@/lib/services";
import { Submission } from "@/lib/services";

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, unknown>>({});

  // Fetch submission data on component mount
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await submissionService.getSubmissionById(params.id);
        setSubmission(data);
        setEditedData(data?.data || {});
      } catch (error) {
        console.error("Error fetching submission:", error);
        toast.error("Failed to load submission");
      }
    };
    
    fetchSubmission();
  }, [params.id]);

  if (!submission) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <h2 className="text-xl font-semibold">Loading submission...</h2>
            <p className="text-muted-foreground mt-2">
              Please wait while we fetch the submission data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'medium' 
    }).format(date);
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      // Call API to update the submission
      await submissionService.updateSubmission(submission.id, {
        data: editedData
      });
      
      // Update the local state
      setSubmission({
        ...submission,
        data: editedData
      });
      
      setIsEditing(false);
      toast.success("Submission updated successfully");
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      // Call API to delete the submission
      const success = await submissionService.deleteSubmission(submission.id);
      
      if (success) {
        toast.success("Submission deleted successfully");
        router.push("/submissions");
      } else {
        throw new Error("Failed to delete submission");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Link 
        href="/submissions" 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Submissions
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submission Details</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isLoading}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this submission
                      and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Form Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Form Name</h3>
                <p>{submission.formName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Form ID</h3>
                <p className="font-mono text-xs">{submission.formId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Submission ID</h3>
                <p className="font-mono text-xs">{submission.submissionId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
                <p>{formatDate(submission.submittedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submission Data</CardTitle>
              <CardDescription>
                {isEditing ? "Edit the submission data below" : "View the decrypted form data"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    {Object.entries(editedData).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium">{key}</label>
                        {typeof value === 'string' && value.length > 100 ? (
                          <textarea
                            className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={value as string}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={String(value)}
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
                        <h3 className="text-sm font-medium">{key}</h3>
                        {typeof value === 'string' && value.length > 100 ? (
                          <div className="mt-1 whitespace-pre-wrap p-3 bg-muted rounded-md text-sm">
                            {value}
                          </div>
                        ) : (
                          <p className="mt-1">{String(value)}</p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 