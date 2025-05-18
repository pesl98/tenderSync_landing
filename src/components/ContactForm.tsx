
import React, { useState } from 'react';
import FormField from './ui/Form';
import Button from './ui/Button';

type FormData = {
  name: string;
  email: string;
  message: string;
};

type ContactFormProps = {
  onClose: () => void;
};

const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
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
        id="message"
        label="Message"
        type="textarea"
        placeholder="How can we help you?"
        required
        value={formData.message}
        onChange={handleChange}
      />
      
      <div className="mt-6">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth
        >
          Send Message
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
