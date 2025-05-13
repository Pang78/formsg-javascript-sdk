"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft, Info, Copy, CheckCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { SimpleAccordion } from "@/components/ui/accordion";
import { SimpleTooltip } from "@/components/ui/tooltip";

export default function AddFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    formId: "",
    secretKey: "",
    webhookUrl: `${window.location.origin}/api/webhooks/formsg`,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you would call an API endpoint to save the form
      // await fetch('/api/forms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Form added successfully");
      router.push("/forms");
    } catch (error) {
      toast.error("Failed to add form");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Link 
        href="/forms" 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forms
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Connect Your FormSG Form</h1>
        <p className="text-muted-foreground mt-2">
          Follow these steps to connect your FormSG form and start receiving submissions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Let's walk through the process of connecting your form
                </CardDescription>
              </div>
              <div className="flex space-x-2 text-sm">
                <div className={`px-2 py-1 rounded-full flex items-center ${currentStep >= 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  <span className="text-xs font-semibold">Step 1</span>
                </div>
                <div className={`px-2 py-1 rounded-full flex items-center ${currentStep >= 2 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  <span className="text-xs font-semibold">Step 2</span>
                </div>
                <div className={`px-2 py-1 rounded-full flex items-center ${currentStep >= 3 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  <span className="text-xs font-semibold">Step 3</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="setup" 
                onClick={() => setCurrentStep(1)}
                className={currentStep >= 1 ? "data-[state=active]:bg-primary" : ""}
              >
                FormSG Setup
              </TabsTrigger>
              <TabsTrigger 
                value="connect" 
                onClick={() => setCurrentStep(2)}
                className={currentStep >= 2 ? "data-[state=active]:bg-primary" : ""}
              >
                Connect Form
              </TabsTrigger>
              <TabsTrigger 
                value="webhook" 
                onClick={() => setCurrentStep(3)}
                className={currentStep >= 3 ? "data-[state=active]:bg-primary" : ""}
              >
                Set Up Webhook
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Create your form on FormSG</h3>
                    <p className="text-muted-foreground mt-1">
                      Go to <a href="https://form.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary underline">form.gov.sg</a> and create your form with the fields you need
                    </p>
                    
                    <div className="mt-4 border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Important Settings in FormSG</h4>
                        <a href="https://guide.form.gov.sg" target="_blank" rel="noopener noreferrer" className="text-sm text-primary">
                          FormSG Documentation →
                        </a>
                      </div>
                      
                      <div className="space-y-1 mt-4">
                        <SimpleAccordion title="Enable End-to-End Encryption">
                          <div className="space-y-2">
                            <p>Make sure to enable end-to-end encryption for your form:</p>
                            <ol className="list-decimal list-inside space-y-1">
                              <li>Go to "Form Settings"</li>
                              <li>Check "Enable end-to-end encryption"</li>
                              <li>Save your settings</li>
                            </ol>
                            <div className="mt-2 text-sm text-muted-foreground">
                              This will generate a secret key for your form that you'll need in the next step.
                            </div>
                          </div>
                        </SimpleAccordion>
                        
                        <SimpleAccordion title="Record Your Secret Key">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-orange-600">
                              <AlertCircle className="h-4 w-4 inline mr-1" /> 
                              Important: Save your secret key securely! It will only be shown once during form creation.
                            </p>
                            <div className="bg-yellow-50 p-2 rounded text-sm">
                              Your secret key will look something like: <code className="bg-gray-100 p-1 rounded">V1kPv99laJMCXCyplYwtIljjcB/9MyiwLH8zyDqoObI=</code>
                            </div>
                          </div>
                        </SimpleAccordion>
                        
                        <SimpleAccordion title="Find Your Form ID">
                          <div className="space-y-2">
                            <p>Your Form ID is in the URL of your form. For example:</p>
                            <div className="bg-gray-100 p-2 rounded text-sm break-all">
                              https://form.gov.sg/#!/<span className="font-bold text-primary">5e4b8e3d1f61f00036c9937d</span>
                            </div>
                            <p className="text-sm">The highlighted part is your Form ID</p>
                          </div>
                        </SimpleAccordion>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => {
                    setCurrentStep(2);
                    document.querySelector('[data-value="connect"]')?.click();
                  }}>
                    Continue to Step 2
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="connect" className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                setCurrentStep(3);
                document.querySelector('[data-value="webhook"]')?.click();
              }}>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div className="space-y-6 w-full">
                      <h3 className="text-lg font-semibold">Connect your FormSG form</h3>
                      <p className="text-muted-foreground">
                        Enter the details of your FormSG form to connect it to this application
                      </p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label htmlFor="name">Form Name</Label>
                            <SimpleTooltip content="This is just a friendly name to help you identify your form in this application.">
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                            </SimpleTooltip>
                          </div>
                          <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Customer Feedback Form"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label htmlFor="formId">Form ID</Label>
                            <SimpleTooltip content="This is found in your form's URL on FormSG: https://form.gov.sg/#!/[Form ID]">
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                            </SimpleTooltip>
                          </div>
                          <Input
                            id="formId"
                            name="formId"
                            placeholder="e.g., 5e4b8e3d1f61f00036c9937d"
                            value={formData.formId}
                            onChange={handleChange}
                            required
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label htmlFor="secretKey">Secret Key</Label>
                            <SimpleTooltip content="This is the private key generated when you enabled end-to-end encryption for your form.">
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                            </SimpleTooltip>
                          </div>
                          <Input
                            id="secretKey"
                            name="secretKey"
                            type="password"
                            placeholder="Paste your secret key here"
                            value={formData.secretKey}
                            onChange={handleChange}
                            required
                            className="w-full"
                          />
                          <p className="text-xs text-orange-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Your secret key is stored securely and used to decrypt form submissions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setCurrentStep(1);
                        document.querySelector('[data-value="setup"]')?.click();
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit">Continue to Step 3</Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="webhook" className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div className="space-y-4 w-full">
                    <h3 className="text-lg font-semibold">Set up the webhook in FormSG</h3>
                    <p className="text-muted-foreground">
                      Configure your FormSG form to send submissions to this application
                    </p>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 border-b p-3">
                        <h4 className="font-medium">Your Webhook URL</h4>
                        <p className="text-xs text-muted-foreground">Copy this URL and add it to your FormSG form settings</p>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-50 text-sm p-3 rounded border flex-1 font-mono overflow-auto">
                            {formData.webhookUrl}
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(formData.webhookUrl);
                              toast.success("Webhook URL copied to clipboard");
                            }}
                            className="flex-shrink-0"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <h4 className="font-medium">How to set up the webhook in FormSG:</h4>
                      <ol className="space-y-4">
                        <li className="flex items-start space-x-2">
                          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                          <div>
                            <p className="font-medium">Go to your form settings in FormSG</p>
                            <p className="text-sm text-muted-foreground">Navigate to the form you created and click on "Settings"</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                          <div>
                            <p className="font-medium">Find the "Webhook" section</p>
                            <p className="text-sm text-muted-foreground">Look for the webhook configuration area in your form settings</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                          <div>
                            <p className="font-medium">Enable webhooks and paste your URL</p>
                            <p className="text-sm text-muted-foreground">Enable the webhook feature and paste the URL copied from above</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                          <div>
                            <p className="font-medium">Save your settings</p>
                            <p className="text-sm text-muted-foreground">Don't forget to save your form settings in FormSG</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                      <div className="flex items-start">
                        <Info className="text-blue-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-800">Testing Your Integration</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            After setup, submit a test response to your form to verify that the integration is working correctly.
                            You should see the submission appear in your dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setCurrentStep(2);
                      document.querySelector('[data-value="connect"]')?.click();
                    }}
                  >
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save & Finish"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
} 