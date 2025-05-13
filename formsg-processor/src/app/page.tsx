import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Database, FileUp, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">FormSG Processor</h1>
          <p className="text-muted-foreground mt-2">
            Consolidate, decrypt, and transform your FormSG submissions
          </p>
        </div>
        <Button asChild>
          <Link href="/forms/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Form
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Forms</CardTitle>
            <CardDescription>Manage your connected FormSG forms</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <FileText className="h-16 w-16 text-muted-foreground/50" />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forms">View All Forms</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>View all your form submissions</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <Database className="h-16 w-16 text-muted-foreground/50" />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/submissions">View Submissions</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Export and download your form data</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <FileUp className="h-16 w-16 text-muted-foreground/50" />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/export">Export Data</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your FormSG Processor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-4 py-4">
              <li>Add a new FormSG form by clicking "Add New Form" button</li>
              <li>Enter your form details including the form ID and secret key</li>
              <li>Set up a webhook endpoint in your FormSG form settings</li>
              <li>Start receiving and processing submissions</li>
              <li>View and export your data from the dashboard</li>
            </ol>
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">Learn About FormSG Integration</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Need help understanding how to use FormSG with this application?
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/guide">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Integration Guide
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
