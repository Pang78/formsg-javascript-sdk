"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  ClipboardCopy,
  Database,
  FileJson,
  HelpCircle,
  Info,
  Key,
  LucideIcon,
  Server,
  Shield,
  Webhook
} from "lucide-react";
import { toast } from "sonner";

const CodeBlock = ({ 
  children, 
  title, 
  language = "javascript" 
}: { 
  children: React.ReactNode; 
  title?: string; 
  language?: string 
}) => (
  <div className="rounded-lg overflow-hidden border bg-gray-50 dark:bg-gray-900">
    {title && (
      <div className="border-b px-4 py-2 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
        <span className="text-sm font-medium">{title}</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2"
          onClick={() => {
            const text = (children as string).toString();
            navigator.clipboard.writeText(text);
            toast.success("Code copied to clipboard");
          }}
        >
          <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Copy</span>
        </Button>
      </div>
    )}
    <pre className={`language-${language} p-4 overflow-x-auto text-sm`}>
      <code className="text-sm">{children}</code>
    </pre>
  </div>
);

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: LucideIcon 
}) => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-sm">{description}</CardDescription>
    </CardContent>
  </Card>
);

export default function GuidePage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Link 
        href="/" 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold">FormSG Integration Guide</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to use FormSG JavaScript SDK to securely receive and process form submissions
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard 
            title="End-to-End Encryption" 
            description="FormSG uses elliptic curve cryptography to ensure only intended recipients can view submissions."
            icon={Shield}
          />
          <FeatureCard 
            title="Webhook Integration" 
            description="Receive form submissions directly in your application via secure webhooks."
            icon={Webhook}
          />
          <FeatureCard 
            title="Data Processing" 
            description="Process and transform your form data using the FormSG JavaScript SDK."
            icon={Database}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What are FormSG Webhooks?</CardTitle>
            <CardDescription>
              Webhooks allow your application to receive FormSG form submissions in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-950/50">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">What happens when a user submits a form</h3>
                    <ol className="mt-2 text-sm space-y-2 text-blue-700 dark:text-blue-400">
                      <li>1. User submits a form on FormSG</li>
                      <li>2. FormSG encrypts the submission with your public key</li>
                      <li>3. FormSG sends the encrypted data to your webhook URL</li>
                      <li>4. Your application verifies and decrypts the submission using your secret key</li>
                      <li>5. Your application processes the decrypted data (store in database, etc.)</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Webhook Authentication Flow</h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm mb-4 md:mb-0">
                      <p className="text-sm font-medium">FormSG</p>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                      <div className="text-xs text-center bg-gray-100 dark:bg-gray-800 rounded p-1 text-gray-600 dark:text-gray-400">
                        Encrypted Data + Signature
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                    </div>
                    <div className="md:hidden flex items-center justify-center my-4">
                      <div className="flex flex-col items-center">
                        <ArrowRight className="rotate-90 h-5 w-5 text-gray-400" />
                        <div className="text-xs text-center bg-gray-100 dark:bg-gray-800 rounded p-1 text-gray-600 dark:text-gray-400 my-2">
                          Encrypted Data + Signature
                        </div>
                        <ArrowRight className="rotate-90 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
                      <p className="text-sm font-medium">Your App</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">X-FormSG-Signature Header Format</h3>
                <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto">
                  <code>t=1582558358788,s=5e53ec96b10ee1010e00380b,f=5e4b8e3d1f61f00036c9937d,v1=rUAgQ9krNZspCrQtfSvRfjME6Nq4+I80apGXnCsNrwPbcq44SBNglWtA1MkpC/VhWtDeJfuV89uV2Aqi42UQBA==</code>
                </pre>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs font-medium">Where:</p>
                    <ul className="text-xs space-y-1 mt-1 list-disc list-inside">
                      <li><span className="font-mono text-primary">t=</span> Timestamp</li>
                      <li><span className="font-mono text-primary">s=</span> Submission ID</li>
                      <li><span className="font-mono text-primary">f=</span> Form ID</li>
                      <li><span className="font-mono text-primary">v1=</span> Signature value</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText('t=1582558358788,s=5e53ec96b10ee1010e00380b,f=5e4b8e3d1f61f00036c9937d,v1=rUAgQ9krNZspCrQtfSvRfjME6Nq4+I80apGXnCsNrwPbcq44SBNglWtA1MkpC/VhWtDeJfuV89uV2Aqi42UQBA==');
                        toast.success("Header example copied to clipboard");
                      }}
                    >
                      Copy Example
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="code">Code Examples</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Setting Up Your Integration</CardTitle>
                <CardDescription>
                  Follow these steps to integrate FormSG with your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <h3 className="font-semibold">Install the FormSG SDK</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Install the SDK in your Node.js project
                      </p>
                      <div className="mt-2">
                        <CodeBlock language="bash">npm install @opengovsg/formsg-sdk --save</CodeBlock>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <h3 className="font-semibold">Create a webhook endpoint in your application</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set up an endpoint to receive form submissions
                      </p>
                      <div className="mt-2">
                        <CodeBlock language="javascript" title="Example Express.js endpoint">
{`const express = require('express');
const app = express();
const formsg = require('@opengovsg/formsg-sdk')();

// Your form's secret key from FormSG
const formSecretKey = process.env.FORM_SECRET_KEY;

// Your webhook URL registered with FormSG
const WEBHOOK_URL = 'https://your-domain.com/api/webhooks/formsg';

app.post('/api/webhooks/formsg', express.json(), (req, res) => {
  try {
    // Verify the webhook signature
    formsg.webhooks.authenticate(req.headers['x-formsg-signature'], WEBHOOK_URL);
    
    // Decrypt the submission
    const submission = formsg.crypto.decrypt(formSecretKey, req.body.data);
    
    if (submission) {
      // Process the submission (e.g., save to database)
      console.log('Form submission:', submission.responses);
      
      // Continue with your business logic...
    }
    
    // Always return 200 OK to acknowledge receipt
    res.status(200).json({ message: 'Submission received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to acknowledge receipt, even if processing failed
    res.status(200).json({ message: 'Error processing submission' });
  }
});

app.listen(3000);`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <h3 className="font-semibold">Configure FormSG with your webhook URL</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set up your webhook in the FormSG dashboard
                      </p>
                      <div className="mt-2 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Go to your form on FormSG</li>
                            <li>Navigate to "Settings"</li>
                            <li>Find the "Webhooks" section</li>
                            <li>Enable webhooks</li>
                            <li>Enter your webhook URL (e.g., <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">https://your-domain.com/api/webhooks/formsg</span>)</li>
                            <li>Save your settings</li>
                          </ol>
                        </div>
                        <div className="flex justify-center">
                          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md inline-flex items-center">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">Your webhook URL must be publicly accessible and use HTTPS</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                    <div>
                      <h3 className="font-semibold">Test your integration</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Verify that your application receives and processes form submissions correctly
                      </p>
                      <div className="mt-2">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <p className="text-sm">Submit a test response to your form</p>
                            </div>
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <p className="text-sm">Check your application logs for successful webhook reception</p>
                            </div>
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <p className="text-sm">Verify that the submission data is properly decrypted and processed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Ready-to-use code snippets for common FormSG integration scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="decrypt" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="decrypt">Decrypting Submissions</TabsTrigger>
                    <TabsTrigger value="webhook">Webhook Verification</TabsTrigger>
                    <TabsTrigger value="attachments">Handling Attachments</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="decrypt" className="space-y-4">
                    <h3 className="text-lg font-medium">Decrypting Form Submissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the FormSG SDK to decrypt encrypted form submissions
                    </p>
                    
                    <CodeBlock language="javascript" title="Basic Decryption">
{`// Initialize the FormSG SDK
const formsg = require('@opengovsg/formsg-sdk')();

// Your form's secret key from FormSG
const formSecretKey = process.env.FORM_SECRET_KEY;

// Decrypt the submission
function decryptSubmission(submissionData) {
  try {
    // Decrypt the submission data
    const decryptedContent = formsg.crypto.decrypt(formSecretKey, submissionData);
    
    if (decryptedContent) {
      // Access the form responses
      const responses = decryptedContent.responses;
      
      // Process the responses
      responses.forEach(field => {
        console.log(\`Question: \${field.question}\`);
        console.log(\`Answer: \${field.answer || field.answerArray?.join(', ')}\`);
        console.log(\`Field Type: \${field.fieldType}\`);
        console.log('---');
      });
      
      return decryptedContent;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to decrypt submission:', error);
    return null;
  }
}`}
                    </CodeBlock>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950/50 p-3 rounded-md">
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Decrypted Form Fields</h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                            Each decrypted form field contains:
                          </p>
                          <ul className="mt-2 text-xs space-y-1 text-yellow-700 dark:text-yellow-400 list-disc list-inside">
                            <li><span className="font-mono">question</span>: The question text from the form</li>
                            <li><span className="font-mono">answer</span>: The submitted answer (for single-value fields)</li>
                            <li><span className="font-mono">answerArray</span>: Array of answers (for multi-value fields)</li>
                            <li><span className="font-mono">fieldType</span>: Type of form field (text, number, checkbox, etc.)</li>
                            <li><span className="font-mono">_id</span>: Unique identifier for the field</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="webhook" className="space-y-4">
                    <h3 className="text-lg font-medium">Webhook Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Authenticate incoming webhooks from FormSG
                    </p>
                    
                    <CodeBlock language="javascript" title="Webhook Authentication">
{`// Initialize the FormSG SDK
const formsg = require('@opengovsg/formsg-sdk')();

// Your webhook URL that's registered with FormSG
const WEBHOOK_URL = 'https://your-domain.com/api/webhooks/formsg';

// Verify webhook signature
function verifyWebhook(signature) {
  try {
    // Authenticate the request using the X-FormSG-Signature header
    formsg.webhooks.authenticate(signature, WEBHOOK_URL);
    
    // If no error is thrown, the webhook is valid
    return true;
  } catch (error) {
    console.error('Webhook verification failed:', error.message);
    return false;
  }
}

// Example usage in an Express.js route
app.post('/api/webhooks/formsg', (req, res) => {
  const signature = req.headers['x-formsg-signature'];
  
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature header' });
  }
  
  if (verifyWebhook(signature)) {
    // Process the webhook payload
    // ...
    res.status(200).json({ message: 'Webhook received' });
  } else {
    // Log the unauthorized attempt but return 200 to acknowledge receipt
    console.log('Unauthorized webhook attempt');
    res.status(200).json({ message: 'Webhook received' });
  }
});`}
                    </CodeBlock>
                    
                    <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-300">Webhook Best Practices</h4>
                          <ul className="mt-2 text-xs space-y-1 text-blue-700 dark:text-blue-400 list-disc list-inside">
                            <li>Always verify the signature of incoming webhooks</li>
                            <li>Return a 200 status even if processing fails to acknowledge receipt</li>
                            <li>Implement idempotency to handle duplicate webhook deliveries</li>
                            <li>Use environment variables to store sensitive keys</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attachments" className="space-y-4">
                    <h3 className="text-lg font-medium">Handling Form Attachments</h3>
                    <p className="text-sm text-muted-foreground">
                      Decrypt and process file attachments from form submissions
                    </p>
                    
                    <CodeBlock language="javascript" title="Decrypting Attachments">
{`// Initialize the FormSG SDK
const formsg = require('@opengovsg/formsg-sdk')();
const fs = require('fs');
const path = require('path');

// Your form's secret key from FormSG
const formSecretKey = process.env.FORM_SECRET_KEY;

// Decrypt submission with attachments
async function decryptSubmissionWithAttachments(submissionData) {
  try {
    // Use the decryptWithAttachments method for submissions with files
    const decryptedContent = await formsg.crypto.decryptWithAttachments(
      formSecretKey, 
      submissionData
    );
    
    if (decryptedContent) {
      console.log('Decrypted form responses:', decryptedContent.content.responses);
      
      // Process attachments
      const { attachments } = decryptedContent;
      
      // Loop through all attachments
      Object.keys(attachments).forEach(fieldId => {
        const { filename, content } = attachments[fieldId];
        
        // content is a Uint8Array of the file
        
        // Example: Save the file to disk
        const uploadDir = path.join(__dirname, 'uploads');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Save the file
        fs.writeFileSync(
          path.join(uploadDir, filename),
          Buffer.from(content)
        );
        
        console.log(\`Saved attachment: \${filename}\`);
      });
      
      return decryptedContent;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to decrypt submission with attachments:', error);
    return null;
  }
}`}
                    </CodeBlock>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950/50 p-3 rounded-md">
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Important Notes on Attachments</h4>
                          <ul className="mt-2 text-xs space-y-1 text-yellow-700 dark:text-yellow-400 list-disc list-inside">
                            <li>File attachments are end-to-end encrypted just like other form data</li>
                            <li>Use <span className="font-mono">decryptWithAttachments</span> instead of <span className="font-mono">decrypt</span> for forms with file uploads</li>
                            <li>Attachment URLs are only valid for one hour from submission time</li>
                            <li>Always validate and scan uploaded files before processing them</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about FormSG integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">What is the FormSG JavaScript SDK?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The FormSG JavaScript SDK is a library that provides utilities for verifying FormSG webhooks and decrypting form submissions. It handles the cryptographic operations needed to securely process form data.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">How does end-to-end encryption work in FormSG?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      FormSG uses elliptic curve cryptography (specifically x25519-xsalsa20-poly1305) to encrypt form submissions. When a form is created with encryption enabled, FormSG generates a keypair. The public key is stored on FormSG servers, while the private key (secret key) is given to the form creator. When a user submits the form, their data is encrypted with the public key, and only someone with the private key can decrypt it. This ensures that even FormSG cannot access the form data.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">What happens if I lose my form's secret key?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you lose your form's secret key, there is no way to recover it or decrypt any submissions that were encrypted with the corresponding public key. You would need to create a new form with a new keypair. This is why it's critical to securely back up your secret key.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Can I use the FormSG SDK with any programming language?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The official FormSG SDK is available for JavaScript/Node.js, Python, and Ruby. If you're using another language, you would need to implement the cryptographic operations yourself based on the specifications in the FormSG documentation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">How do I test my webhook integration?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The best way to test your webhook integration is to submit a test response to your form and check if your application receives and processes it correctly. Make sure your webhook endpoint is publicly accessible and uses HTTPS. You can also use tools like Ngrok to expose a local development server to the internet for testing.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Is there a size limit for file attachments?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yes, FormSG has file size limits for attachments. The specific limit can vary, but it's typically around 7MB per file. When processing attachments with the SDK, remember that the attachment URLs are only valid for one hour after submission.
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Still Have Questions?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">FormSG Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Visit the official FormSG documentation for detailed information
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="https://guide.form.gov.sg" target="_blank">
                            <FileJson className="mr-2 h-4 w-4" />
                            View Docs
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">GitHub Repository</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Check out the FormSG SDK source code on GitHub
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="https://github.com/opengovsg/formsg-javascript-sdk" target="_blank">
                            <Server className="mr-2 h-4 w-4" />
                            View Source
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 