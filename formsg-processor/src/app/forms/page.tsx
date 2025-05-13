"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Edit, ExternalLink } from "lucide-react";
import { useState } from "react";

// This would come from your database in a real app
const DEMO_FORMS = [
  {
    id: "form1",
    name: "Customer Feedback",
    formId: "5e4b8e3d1f61f00036c9937d",
    createdAt: "2023-01-15",
    submissionCount: 24
  },
  {
    id: "form2",
    name: "Job Application",
    formId: "6f5c9f4e2g72g00047d0048e",
    createdAt: "2023-02-20",
    submissionCount: 18
  }
];

export default function FormsPage() {
  const [forms, setForms] = useState(DEMO_FORMS);

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the form
    setForms(forms.filter(form => form.id !== id));
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <Button asChild>
          <Link href="/forms/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Form
          </Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">No forms added yet</h2>
              <p className="text-muted-foreground">Add your first FormSG form to get started</p>
              <Button asChild>
                <Link href="/forms/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Form
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{form.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Form ID:</span>
                  <span className="font-mono text-xs">{form.formId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{form.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submissions:</span>
                  <span>{form.submissionCount}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/forms/${form.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(form.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/submissions?formId=${form.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Submissions
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 