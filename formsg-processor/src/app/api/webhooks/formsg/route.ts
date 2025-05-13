import { NextRequest, NextResponse } from "next/server";
import formsg from "@opengovsg/formsg-sdk";
import { formService, submissionService } from "@/lib/services";
import { FormResponse } from "@/lib/transforms";

// Initialize the FormSG SDK
const formsgSdk = formsg();

export async function POST(req: NextRequest) {
  try {
    // Get the FormSG signature from the request headers
    const signature = req.headers.get("X-FormSG-Signature");
    
    if (!signature) {
      return NextResponse.json(
        { error: "Missing X-FormSG-Signature header" },
        { status: 401 }
      );
    }

    // Verify the webhook signature
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/formsg`;
    
    try {
      // Authenticate the request
      formsgSdk.webhooks.authenticate(signature, webhookUrl);
    } catch (error) {
      console.error("FormSG webhook authentication failed:", error);
      return NextResponse.json(
        { error: "FormSG webhook authentication failed" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Look up the form in the database to get the secret key
    const form = await formService.getFormByFormId(body.formId);
    
    if (!form) {
      console.error("Form not found for form ID:", body.formId);
      // Return 200 status even if processing fails to acknowledge receipt
      return NextResponse.json(
        { message: "Webhook received but form not found" },
        { status: 200 }
      );
    }

    // Get the form secret key
    const formSecretKey = form.secretKey;
    
    // Decrypt the submission
    let submission;
    try {
      // Check if submission has attachments
      if (body.data && body.data.attachmentDownloadUrls) {
        submission = await formsgSdk.crypto.decryptWithAttachments(
          formSecretKey,
          body.data
        );
      } else {
        submission = formsgSdk.crypto.decrypt(formSecretKey, body.data);
      }
    } catch (error) {
      console.error("Failed to decrypt submission:", error);
      // Return 200 status even if decryption fails to acknowledge receipt
      return NextResponse.json(
        { message: "Webhook received but could not decrypt submission" },
        { status: 200 }
      );
    }

    if (!submission) {
      console.error("Decryption returned null");
      return NextResponse.json(
        { message: "Webhook received but decryption returned null" },
        { status: 200 }
      );
    }

    // Process the submission and save to database
    try {
      // Convert the FormSG responses to a flat object for easier access
      const flatData: Record<string, unknown> = {};
      
      // Handle both DecryptedContent and DecryptedContentAndAttachments types
      const responses = 'responses' in submission ? submission.responses : [];
      
      responses.forEach((response: any) => {
        flatData[response.question] = response.answer || response.answerArray;
      });
      
      // Save the submission to the database
      await submissionService.saveSubmission({
        formId: body.formId,
        submissionId: body.submissionId, 
        submittedAt: body.created,
        data: flatData,
        rawResponses: 'responses' in submission ? submission as FormResponse : undefined
      });
      
      console.log("Submission saved successfully:", body.submissionId);
      
      return NextResponse.json(
        { message: "Webhook received and processed successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error saving submission to database:", error);
      return NextResponse.json(
        { message: "Webhook received but could not save submission" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing FormSG webhook:", error);
    // Always return 200 to the webhook to acknowledge receipt
    return NextResponse.json(
      { message: "Webhook received but encountered an error" },
      { status: 200 }
    );
  }
}

// Returns a 405 Method Not Allowed for non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
} 