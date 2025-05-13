'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { toast } from 'sonner';
import formsgSdk from '@opengovsg/formsg-sdk';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning, Upload, Trash2, Download, Loader2 } from 'lucide-react';

// Define the structure of a decrypted response (based on common usage)
interface DecryptedResponse {
    [question: string]: string | undefined;
}

// Define the structure of FormSG FormField based on SDK README
interface FormField {
    _id: string;
    question: string;
    answer?: string;
    answerArray?: string[];
    fieldType: string;
}

// Define the structure returned by the SDK's decrypt function
interface DecryptResult {
    responses: FormField[];
    verified?: Record<string, any>;
}

// Define the structure of the input JSON file (assuming common webhook structure)
interface SubmissionJson {
    data: {
        submissionId: string;
        formId: string;
        encryptedContent: string;
        created: string;
        // Potentially other fields like version, verifiedContent, attachments, payment
    };
}

export default function HomePage() {
    const [secretKey, setSecretKey] = useState<string>('');
    const [allResponses, setAllResponses] = useState<DecryptedResponse[]>([]);
    const [allHeaders, setAllHeaders] = useState<Set<string>>(new Set());
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [currentFileContent, setCurrentFileContent] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Instantiate SDK - do this outside render, but careful with server-side rendering if applicable
    // Since this is 'use client', it's fine here.
    const formsg = formsgSdk();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== 'application/json') {
                toast.error('Invalid File Type', { description: 'Please upload a JSON file.' });
                setUploadedFileName(null);
                setCurrentFileContent(null);
                if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    // Basic validation if it's JSON
                    JSON.parse(text);
                    setCurrentFileContent(text);
                    setUploadedFileName(file.name);
                    toast.info(`File "${file.name}" loaded.`);
                } catch (error) {
                    toast.error('Invalid JSON File', { description: 'The uploaded file could not be parsed as JSON.' });
                    setUploadedFileName(null);
                    setCurrentFileContent(null);
                     if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
                }
            };
            reader.onerror = () => {
                toast.error('File Read Error', { description: 'Could not read the selected file.' });
                setUploadedFileName(null);
                setCurrentFileContent(null);
                 if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
            };
            reader.readAsText(file);
        }
    };

    const handleDecrypt = () => {
        if (!secretKey) {
            toast.warning('Missing Secret Key', { description: 'Please enter the Form Secret Key.' });
            return;
        }
        if (!currentFileContent) {
            toast.warning('Missing File', { description: 'Please upload a submission JSON file.' });
            return;
        }

        setIsProcessing(true);
        // Use setTimeout to allow UI to update before potentially blocking decryption
        setTimeout(() => {
             try {
                const submissionJson: SubmissionJson = JSON.parse(currentFileContent);

                // Validate structure - Check for data and encryptedContent
                if (!submissionJson.data || typeof submissionJson.data.encryptedContent !== 'string') {
                     throw new Error('Invalid JSON structure. Required path `data.encryptedContent` not found.');
                }

                const encryptedContent = submissionJson.data.encryptedContent;

                const submission: DecryptResult | null = formsg.crypto.decrypt(secretKey, { encryptedContent });

                if (submission?.responses) {
                    const formattedResponse: DecryptedResponse = {};
                    const currentHeaders = new Set<string>();

                    submission.responses.forEach((field: FormField) => {
                        const question = field.question;
                        const answer = field.answerArray ? field.answerArray.join(', ') : field.answer ?? ''; // Handle undefined answer
                        formattedResponse[question] = answer;
                        currentHeaders.add(question);
                    });

                    setAllResponses(prevResponses => [...prevResponses, formattedResponse]);
                    setAllHeaders(prevHeaders => new Set([...prevHeaders, ...currentHeaders]));

                    toast.success('Decryption Successful', { description: `Added data from ${uploadedFileName}.` });

                    // Clear file input for next upload
                    setCurrentFileContent(null);
                    setUploadedFileName(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                } else {
                    toast.error('Decryption Failed', { description: 'Check your Secret Key or the JSON file content.' });
                }
            } catch (error: any) { // Catch specific errors
                 console.error('Decryption/Processing error:', error);
                 if (error instanceof SyntaxError) {
                    toast.error('JSON Parse Error', { description: 'The uploaded file is not valid JSON.' });
                 } else if (error.message.includes('Invalid JSON structure')) {
                     toast.error('Invalid JSON Structure', { description: error.message });
                 } else {
                    toast.error('Processing Error', { description: `An unexpected error occurred: ${error.message}` });
                 }
            } finally {
                setIsProcessing(false);
            }
        }, 50); // Short delay
    };

    const handleClearAll = () => {
        setSecretKey('');
        setAllResponses([]);
        setAllHeaders(new Set());
        setCurrentFileContent(null);
        setUploadedFileName(null);
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.info('Cleared all data and inputs.');
    };

    // --- CSV Export Logic --- (Copied and adapted from previous script.js)
    function escapeCsvCell(cellData: any): string {
        let stringData = String(cellData ?? ''); // Handle null/undefined
        if (stringData.search(/([",\n])/g) >= 0) {
            stringData = stringData.replace(/"/g, '""');
            stringData = `"${stringData}"`;
        }
        return stringData;
    }

    function handleExportCsv() {
        if (allResponses.length === 0) {
            toast.warning('No Data', { description: 'There is no data to export.' });
            return;
        }

        const headers = Array.from(allHeaders);
        const csvRows: string[] = [];

        csvRows.push(headers.map(escapeCsvCell).join(','));

        allResponses.forEach(response => {
            const values = headers.map(header => {
                const value = response[header];
                return escapeCsvCell(value);
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'formsg_combined_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up blob URL
        toast.success('Export Successful', { description: 'CSV file download started.' });
    }
    // --- End CSV Export Logic ---

    const headersArray = Array.from(allHeaders);

    return (
        <main className="container mx-auto p-4 md:p-8 space-y-8">
            <header className="text-center">
                <h1 className="text-3xl font-bold mb-2">FormSG Response Processor</h1>
                <p className="text-muted-foreground">Upload FormSG submission JSON files, decrypt, combine, and export.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>1. Input Form Data</CardTitle>
                    <CardDescription>Provide your Form Secret Key and upload the submission JSON file.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="secretKey">Form Secret Key</Label>
                        <Input
                            id="secretKey"
                            type="password"
                            placeholder="Paste your form secret key here"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="space-y-2">
                         <Label htmlFor="fileUpload">Submission JSON File</Label>
                         <div className="flex items-center space-x-2">
                            <Input
                                id="fileUpload"
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={isProcessing}
                                className="flex-grow"
                            />
                         </div>
                         {uploadedFileName && (
                             <p className="text-sm text-muted-foreground">Loaded: {uploadedFileName}</p>
                         )}
                    </div>

                     <Alert className='mt-4'>
                        <FileWarning className="h-4 w-4" />
                        <AlertTitle>Security Note</AlertTitle>
                        <AlertDescription>
                            Decryption happens entirely in your browser. Your Secret Key and submission data are never sent to any server.
                        </AlertDescription>
                    </Alert>

                    <Button onClick={handleDecrypt} disabled={isProcessing || !currentFileContent || !secretKey}>
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Decrypting...</>
                        ) : (
                            <><Upload className="mr-2 h-4 w-4" /> Decrypt & Add Data</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>2. Combined Data</CardTitle>
                    <CardDescription>View the combined decrypted responses below. New data is appended.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex justify-end space-x-2 mb-4">
                        <Button variant="outline" onClick={handleClearAll} disabled={isProcessing || allResponses.length === 0}>
                           <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                        </Button>
                        <Button onClick={handleExportCsv} disabled={isProcessing || allResponses.length === 0}>
                           <Download className="mr-2 h-4 w-4" /> Export as CSV
                        </Button>
                    </div>

                     <div className="border rounded-md overflow-hidden">
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     {headersArray.length > 0 ? (
                                         headersArray.map(header => <TableHead key={header}>{header}</TableHead>)
                                     ) : (
                                         <TableHead>No data headers</TableHead>
                                     )}
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {allResponses.length > 0 ? (
                                     allResponses.map((response, index) => (
                                         <TableRow key={index}>
                                             {headersArray.map(header => (
                                                 <TableCell key={`${index}-${header}`}>{response[header] ?? ''}</TableCell>
                                             ))}
                                         </TableRow>
                                     ))
                                 ) : (
                                     <TableRow>
                                         <TableCell colSpan={headersArray.length || 1} className="h-24 text-center">
                                             No data added yet. Upload and decrypt a submission file.
                                         </TableCell>
                                     </TableRow>
                                 )}
                             </TableBody>
                         </Table>
                     </div>
                </CardContent>
            </Card>
        </main>
    );
} 