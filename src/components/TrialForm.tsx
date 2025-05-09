import React, { useState } from 'react';
import FormField from './ui/Form';
import Button from './ui/Button';
import { supabase } from '../lib/supabase';

type FormData = {
  email: string;
  name: string;
  telephone: string;
  companyName: string;
  companyDescription: string;
  country: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type TrialFormProps = {
  onSuccess: () => void;
};

const TrialForm: React.FC<TrialFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    telephone: '',
    companyName: '',
    companyDescription: '',
    country: 'The Netherlands',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setGeneralError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.companyDescription) {
      newErrors.companyDescription = 'Company description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // First check if email exists
      const { data: existingTrial, error: checkError } = await supabase
        .from('t_trial_subscriptions')
        .select('created_at')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingTrial) {
        const requestDate = new Date(existingTrial.created_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
        setGeneralError(`You have already requested a Trial subscription on ${requestDate}`);
        return;
      }

      // If no existing trial, insert new one
      const { error: insertError } = await supabase
        .from('t_trial_subscriptions')
        .insert([
          {
            email: formData.email,
            name: formData.name,
            telephone: formData.telephone,
            company_name: formData.companyName,
            company_description: formData.companyDescription,
            country: formData.country,
            source_app: 'TenderSync'
          },
        ]);

      if (insertError) {
        // Check for unique constraint violation
        if (insertError.code === '23505') {
          setGeneralError('This email has already been used for a trial subscription.');
          return;
        }
        throw insertError;
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setGeneralError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {generalError}
        </div>
      )}
      
      <FormField
        id="email"
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        required
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      
      <FormField
        id="name"
        label="Your Name"
        placeholder="John Doe"
        required
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      
      <FormField
        id="telephone"
        label="Telephone (Optional)"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={formData.telephone}
        onChange={handleChange}
      />
      
      <FormField
        id="companyName"
        label="Company Name"
        placeholder="Your Company Ltd."
        required
        value={formData.companyName}
        onChange={handleChange}
        error={errors.companyName}
      />
      
      <FormField
        id="companyDescription"
        label="Company Description"
        type="textarea"
        placeholder="Tell us about your company and what type of tenders you're interested in..."
        required
        value={formData.companyDescription}
        onChange={handleChange}
        error={errors.companyDescription}
      />
      
      <div className="space-y-1">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="The Netherlands">The Netherlands</option>
          <option value="Belgium">Belgium</option>
          <option value="Germany">Germany</option>
        </select>
      </div>
      
      <div className="mt-6">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default TrialForm;