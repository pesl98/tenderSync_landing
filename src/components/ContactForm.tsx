
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

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

      onClose();
      alert('Thanks for contacting TenderSync, we will contact you asap');
      setTimeout(() => {
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
      
      <FormField
        id="message"
        label="Message"
        type="textarea"
        placeholder="How can we help you?"
        required
        value={formData.message}
        onChange={handleChange}
      />
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
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
