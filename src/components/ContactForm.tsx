
import React, { useState } from 'react';
import FormField from './ui/Form';
import Button from './ui/Button';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactFormProps = {
  onClose: () => void;
};

const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('contact_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/');
      }, 5000);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Contact TenderSync</h2>
        <p className="text-gray-600 mt-2">We'd love to hear from you</p>
      </div>
      
      <FormField
        id="name"
        label="Your Name"
        placeholder="John Doe"
        required
        value={formData.name}
        onChange={handleChange}
      />
      
      <FormField
        id="email"
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        required
        value={formData.email}
        onChange={handleChange}
      />

      <FormField
        id="phone"
        label="Phone Number (optional)"
        type="tel"
        placeholder="+31 6 12345678"
        value={formData.phone}
        onChange={handleChange}
      />
      
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          required
          placeholder="How can we help you?"
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
          rows={4}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mt-4">
          Thanks for contacting TenderSync, we will contact you asap
        </div>
      )}
      <div className="mt-6">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
