/**
 * Utility functions for transforming FormSG data
 */

type FormField = {
  _id: string;
  question: string;
  answer?: string;
  answerArray?: string[];
  fieldType: string;
};

export interface FormResponse {
  responses: FormField[];
  verified?: Record<string, any>;
}

export const transforms = {
  /**
   * Normalizes phone numbers to a consistent format
   * Removes spaces, dashes, parentheses, and converts to E.164 format if possible
   */
  normalizePhoneNumbers: (submission: FormResponse): FormResponse => {
    const phoneLikeFields = ['phone', 'mobile', 'contact', 'tel', 'telephone', 'handphone'];
    
    const normalizedResponses = submission.responses.map(field => {
      // Check if the field looks like a phone field
      const isPhoneField = 
        field.fieldType === 'mobile' || 
        phoneLikeFields.some(term => 
          field.question.toLowerCase().includes(term)
        );

      if (isPhoneField && field.answer) {
        const normalizedPhone = field.answer
          .replace(/\s+/g, '')
          .replace(/[-()]/g, '');
        
        // If it starts with a '+', assume it's already in international format
        // Otherwise, for Singapore numbers, add +65 if it's an 8-digit number starting with 8 or 9
        const formattedPhone = 
          normalizedPhone.startsWith('+') 
            ? normalizedPhone 
            : /^[89]\d{7}$/.test(normalizedPhone)
              ? `+65${normalizedPhone}`
              : normalizedPhone;
              
        return { ...field, answer: formattedPhone };
      }
      return field;
    });

    return { ...submission, responses: normalizedResponses };
  },

  /**
   * Formats dates in a consistent manner (YYYY-MM-DD)
   */
  formatDates: (submission: FormResponse): FormResponse => {
    const dateLikeFields = ['date', 'dob', 'birth', 'birthday', 'day'];
    
    const formatDateString = (dateStr: string): string => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; // Return original if invalid
        
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      } catch (e) {
        return dateStr; // Return original if there's an error
      }
    };

    const formattedResponses = submission.responses.map(field => {
      // Check if it's a date field
      const isDateField = 
        field.fieldType === 'date' || 
        dateLikeFields.some(term => 
          field.question.toLowerCase().includes(term)
        );

      if (isDateField && field.answer) {
        return { ...field, answer: formatDateString(field.answer) };
      }
      return field;
    });

    return { ...submission, responses: formattedResponses };
  },

  /**
   * Trims whitespace from text fields
   */
  trimWhitespace: (submission: FormResponse): FormResponse => {
    const trimmedResponses = submission.responses.map(field => {
      if (field.answer) {
        return { ...field, answer: field.answer.trim() };
      }
      if (field.answerArray) {
        return { ...field, answerArray: field.answerArray.map(a => a.trim()) };
      }
      return field;
    });

    return { ...submission, responses: trimmedResponses };
  },

  /**
   * Clean and normalize email addresses
   */
  cleanEmails: (submission: FormResponse): FormResponse => {
    const emailLikeFields = ['email', 'e-mail', 'mail'];
    
    const cleanedResponses = submission.responses.map(field => {
      // Check if it's an email field
      const isEmailField = 
        field.fieldType === 'email' || 
        emailLikeFields.some(term => 
          field.question.toLowerCase().includes(term)
        );

      if (isEmailField && field.answer) {
        // Lowercase and trim spaces
        const cleanedEmail = field.answer.toLowerCase().trim();
        return { ...field, answer: cleanedEmail };
      }
      return field;
    });

    return { ...submission, responses: cleanedResponses };
  },

  /**
   * Apply multiple transformations in sequence
   */
  applyTransformations: (
    submission: FormResponse, 
    transformations: string[]
  ): FormResponse => {
    let transformedData = { ...submission };
    
    if (transformations.includes('normalize_phone_numbers')) {
      transformedData = transforms.normalizePhoneNumbers(transformedData);
    }
    
    if (transformations.includes('format_dates')) {
      transformedData = transforms.formatDates(transformedData);
    }
    
    if (transformations.includes('trim_whitespace')) {
      transformedData = transforms.trimWhitespace(transformedData);
    }
    
    if (transformations.includes('clean_emails')) {
      transformedData = transforms.cleanEmails(transformedData);
    }
    
    return transformedData;
  }
}; 