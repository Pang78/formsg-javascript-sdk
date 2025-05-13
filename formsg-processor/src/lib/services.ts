/**
 * Service functions for handling forms and submissions
 */

import { db } from './db';
import { transforms, FormResponse } from './transforms';

export interface Form {
  id: string;
  name: string;
  formId: string;
  secretKey: string;
  webhookUrl: string;
  createdAt: string;
  submissionCount: number;
  userId: string;
}

export interface Submission {
  id: string;
  formId: string;
  formName?: string;
  submissionId: string;
  submittedAt: string;
  data: Record<string, unknown>;
  rawResponses?: FormResponse;
}

export const formService = {
  /**
   * Get all forms for a user
   */
  getForms: async (userId: string): Promise<Form[]> => {
    const forms = await db.form.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { submissions: true } } }
    });
    
    return forms.map(form => ({
      id: form.id,
      name: form.name,
      formId: form.formId,
      secretKey: form.secretKey,
      webhookUrl: form.webhookUrl,
      createdAt: form.createdAt.toISOString(),
      submissionCount: form._count.submissions,
      userId: form.userId
    }));
  },

  /**
   * Get a form by ID
   */
  getFormById: async (id: string): Promise<Form | null> => {
    const form = await db.form.findUnique({
      where: { id },
      include: { _count: { select: { submissions: true } } }
    });
    
    if (!form) return null;
    
    return {
      id: form.id,
      name: form.name,
      formId: form.formId,
      secretKey: form.secretKey,
      webhookUrl: form.webhookUrl,
      createdAt: form.createdAt.toISOString(),
      submissionCount: form._count.submissions,
      userId: form.userId
    };
  },

  /**
   * Get a form by FormSG form ID
   */
  getFormByFormId: async (formId: string): Promise<Form | null> => {
    const form = await db.form.findUnique({
      where: { formId },
      include: { _count: { select: { submissions: true } } }
    });
    
    if (!form) return null;
    
    return {
      id: form.id,
      name: form.name,
      formId: form.formId,
      secretKey: form.secretKey,
      webhookUrl: form.webhookUrl,
      createdAt: form.createdAt.toISOString(),
      submissionCount: form._count.submissions,
      userId: form.userId
    };
  },

  /**
   * Add a new form
   */
  addForm: async (form: Omit<Form, 'id' | 'createdAt' | 'submissionCount'>): Promise<Form> => {
    const newForm = await db.form.create({
      data: {
        name: form.name,
        formId: form.formId,
        secretKey: form.secretKey,
        webhookUrl: form.webhookUrl,
        user: { connect: { id: form.userId } }
      },
      include: { _count: { select: { submissions: true } } }
    });
    
    return {
      id: newForm.id,
      name: newForm.name,
      formId: newForm.formId,
      secretKey: newForm.secretKey,
      webhookUrl: newForm.webhookUrl,
      createdAt: newForm.createdAt.toISOString(),
      submissionCount: newForm._count.submissions,
      userId: newForm.userId
    };
  },

  /**
   * Update a form
   */
  updateForm: async (id: string, updates: Partial<Form>): Promise<Form | null> => {
    const { submissionCount, ...updateData } = updates;
    
    const updatedForm = await db.form.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { submissions: true } } }
    });
    
    return {
      id: updatedForm.id,
      name: updatedForm.name,
      formId: updatedForm.formId,
      secretKey: updatedForm.secretKey,
      webhookUrl: updatedForm.webhookUrl,
      createdAt: updatedForm.createdAt.toISOString(),
      submissionCount: updatedForm._count.submissions,
      userId: updatedForm.userId
    };
  },

  /**
   * Delete a form
   */
  deleteForm: async (id: string): Promise<boolean> => {
    try {
      await db.form.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Error deleting form:", error);
      return false;
    }
  }
};

export const submissionService = {
  /**
   * Get all submissions
   */
  getSubmissions: async (options?: {
    formId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }): Promise<Submission[]> => {
    // Build the where clause based on options
    const where: any = {};
    
    if (options?.formId) {
      where.formId = options.formId;
    }
    
    if (options?.userId) {
      where.form = { userId: options.userId };
    }
    
    if (options?.startDate || options?.endDate) {
      where.submittedAt = {};
      
      if (options?.startDate) {
        where.submittedAt.gte = new Date(options.startDate);
      }
      
      if (options?.endDate) {
        where.submittedAt.lte = new Date(options.endDate);
      }
    }
    
    // Get submissions from database
    const submissions = await db.submission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: { form: { select: { name: true } } }
    });
    
    // If search is provided, filter results in memory
    // Note: For production with large datasets, consider implementing full-text search
    let results = submissions;
    
    if (options?.search && options.search.trim() !== '') {
      const searchTerm = options.search.toLowerCase();
      results = submissions.filter(sub => {
        // Search in submission data
        const dataMatches = Object.values(sub.data as Record<string, any>).some(value => 
          String(value).toLowerCase().includes(searchTerm)
        );
        
        // Search in submission ID
        const idMatches = sub.submissionId.toLowerCase().includes(searchTerm);
        
        return dataMatches || idMatches;
      });
    }
    
    // Map to the expected format
    return results.map(sub => ({
      id: sub.id,
      formId: sub.formId,
      formName: sub.form.name,
      submissionId: sub.submissionId,
      submittedAt: sub.submittedAt.toISOString(),
      data: sub.data as Record<string, unknown>,
      rawResponses: sub.rawResponses as FormResponse | undefined
    }));
  },

  /**
   * Get a submission by ID
   */
  getSubmissionById: async (id: string): Promise<Submission | null> => {
    const submission = await db.submission.findUnique({
      where: { id },
      include: { form: { select: { name: true } } }
    });
    
    if (!submission) return null;
    
    return {
      id: submission.id,
      formId: submission.formId,
      formName: submission.form.name,
      submissionId: submission.submissionId,
      submittedAt: submission.submittedAt.toISOString(),
      data: submission.data as Record<string, unknown>,
      rawResponses: submission.rawResponses as FormResponse | undefined
    };
  },

  /**
   * Save a new submission
   */
  saveSubmission: async (submission: {
    formId: string;
    submissionId: string;
    submittedAt?: string;
    data: Record<string, unknown>;
    rawResponses?: FormResponse;
  }): Promise<Submission> => {
    // Find the form by FormSG formId
    const form = await db.form.findUnique({
      where: { formId: submission.formId }
    });
    
    if (!form) {
      throw new Error(`Form with ID ${submission.formId} not found`);
    }
    
    // Create the submission
    const newSubmission = await db.submission.create({
      data: {
        submissionId: submission.submissionId,
        submittedAt: submission.submittedAt ? new Date(submission.submittedAt) : new Date(),
        data: submission.data,
        rawResponses: submission.rawResponses || null,
        form: { connect: { id: form.id } }
      },
      include: { form: { select: { name: true } } }
    });
    
    return {
      id: newSubmission.id,
      formId: newSubmission.formId,
      formName: newSubmission.form.name,
      submissionId: newSubmission.submissionId,
      submittedAt: newSubmission.submittedAt.toISOString(),
      data: newSubmission.data as Record<string, unknown>,
      rawResponses: newSubmission.rawResponses as FormResponse | undefined
    };
  },

  /**
   * Update a submission
   */
  updateSubmission: async (id: string, updates: Partial<Omit<Submission, 'id'>>): Promise<Submission | null> => {
    // Prepare update data
    const updateData: any = {};
    
    if (updates.data) {
      updateData.data = updates.data;
    }
    
    if (updates.rawResponses) {
      updateData.rawResponses = updates.rawResponses;
    }
    
    // Update the submission
    const updatedSubmission = await db.submission.update({
      where: { id },
      data: updateData,
      include: { form: { select: { name: true } } }
    });
    
    return {
      id: updatedSubmission.id,
      formId: updatedSubmission.formId,
      formName: updatedSubmission.form.name,
      submissionId: updatedSubmission.submissionId,
      submittedAt: updatedSubmission.submittedAt.toISOString(),
      data: updatedSubmission.data as Record<string, unknown>,
      rawResponses: updatedSubmission.rawResponses as FormResponse | undefined
    };
  },

  /**
   * Delete a submission
   */
  deleteSubmission: async (id: string): Promise<boolean> => {
    try {
      await db.submission.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Error deleting submission:", error);
      return false;
    }
  },

  /**
   * Export submissions with optional transformations
   */
  exportSubmissions: async (options: {
    formId?: string;
    startDate?: string;
    endDate?: string;
    format: 'json' | 'csv' | 'xlsx';
    transformations?: string[];
    userId?: string;
  }): Promise<string | Blob> => {
    // Get submissions based on filters
    const submissions = await submissionService.getSubmissions({
      formId: options.formId,
      startDate: options.startDate,
      endDate: options.endDate,
      userId: options.userId
    });
    
    // Apply transformations if specified and if we have raw responses
    const processedSubmissions = submissions.map(submission => {
      if (options.transformations?.length && submission.rawResponses) {
        const transformedData = transforms.applyTransformations(
          submission.rawResponses,
          options.transformations
        );
        
        // Convert the transformed responses to a flat object
        const flatData: Record<string, unknown> = {};
        transformedData.responses.forEach(response => {
          flatData[response.question] = response.answer || response.answerArray;
        });
        
        return {
          ...submission,
          data: flatData
        };
      }
      
      return submission;
    });
    
    // Format the data according to the requested format
    if (options.format === 'json') {
      return JSON.stringify(processedSubmissions, null, 2);
    }
    
    if (options.format === 'csv') {
      // In a real app, you would use a library to properly format CSV
      // This is a simple implementation for demonstration
      const headers = ['Form', 'Submission ID', 'Date', ...Object.keys(processedSubmissions[0]?.data || {})];
      const rows = processedSubmissions.map(sub => {
        const baseValues = [sub.formName || '', sub.submissionId, new Date(sub.submittedAt).toLocaleString()];
        const dataValues = headers.slice(3).map(header => String(sub.data[header] || ''));
        return [...baseValues, ...dataValues].join(',');
      });
      
      return [headers.join(','), ...rows].join('\n');
    }
    
    // For XLSX, in a real app you would use a library like exceljs or xlsx
    // Here we just return a placeholder
    return "XLSX format would be generated here using a proper library";
  }
}; 