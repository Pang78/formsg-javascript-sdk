"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, Search, Filter } from "lucide-react";

// Sample data - in a real app this would come from an API/database
const DEMO_SUBMISSIONS = [
  {
    id: "sub1",
    formId: "form1",
    formName: "Customer Feedback",
    submissionId: "5e53ec96b10ee1010e00380b",
    submittedAt: "2023-05-10T09:15:32Z",
    data: {
      name: "John Smith",
      email: "john@example.com",
      feedback: "Great service!",
      rating: "5"
    }
  },
  {
    id: "sub2",
    formId: "form1",
    formName: "Customer Feedback",
    submissionId: "6f64fd07c21ff121ef31491c",
    submittedAt: "2023-05-11T14:22:45Z",
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      feedback: "Could improve response time",
      rating: "3"
    }
  },
  {
    id: "sub3",
    formId: "form2",
    formName: "Job Application",
    submissionId: "7g75ge18d32gg232fg42502d",
    submittedAt: "2023-05-12T10:05:18Z",
    data: {
      name: "Sam Wilson",
      email: "sam@example.com",
      position: "Software Engineer",
      experience: "5 years"
    }
  }
];

export default function SubmissionsPage() {
  const searchParams = useSearchParams();
  const formIdFilter = searchParams.get("formId");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<string | null>(formIdFilter);

  // Extract unique form options for the filter
  const formOptions = useMemo(() => {
    const uniqueForms = new Set(DEMO_SUBMISSIONS.map(sub => sub.formId));
    return Array.from(uniqueForms).map(formId => {
      const form = DEMO_SUBMISSIONS.find(sub => sub.formId === formId);
      return {
        id: formId,
        name: form?.formName || "Unknown Form"
      };
    });
  }, []);

  // Filter submissions based on search term and selected form
  const filteredSubmissions = useMemo(() => {
    return DEMO_SUBMISSIONS.filter(submission => {
      const matchesSearch = searchTerm === "" || 
        Object.values(submission.data).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        submission.submissionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesForm = selectedForm === null || submission.formId === selectedForm;
      
      return matchesSearch && matchesForm;
    });
  }, [searchTerm, selectedForm]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>All Submissions</span>
            <div className="flex space-x-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search submissions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-[200px]">
                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <select 
                  className="w-full h-10 pl-8 pr-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedForm || ""}
                  onChange={(e) => setSelectedForm(e.target.value === "" ? null : e.target.value)}
                >
                  <option value="">All Forms</option>
                  {formOptions.map(form => (
                    <option key={form.id} value={form.id}>{form.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">No submissions found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.formName}</TableCell>
                    <TableCell className="font-mono text-xs">{submission.submissionId}</TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {Object.entries(submission.data).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            <span className="text-muted-foreground">{key}:</span> {value.toString().substring(0, 20)}{value.toString().length > 20 && '...'}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/submissions/${submission.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 