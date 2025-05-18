import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ContactForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const businessEmail = formData.get('businessEmail') as string;
    const phoneNumber = formData.get('telephone') as string; // Changed name from 'phoneNumber' to 'telephone' to match input field
    const messageText = formData.get('message') as string;

    const { error } = await supabase
      .from('contact_requests')
      .insert([
        {
          name: `${firstName} ${lastName}`,
          email: businessEmail,
          phone: phoneNumber,
          message: messageText,
        },
      ]);

    if (error) {
      console.error('Error inserting contact request:', error);
      setMessage('There was an error submitting your request. Please try again.');
    } else {
      setMessage('Thanks for contacting TenderSync, we will get back to you asap.');
      setTimeout(() => navigate('/'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Get in touch</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
 First Name*
          </label>
          <input
            type="text"
            id="first-name"
            name="firstName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
            Last Name*
          </label>
          <input
            type="text"
            id="last-name"
            name="lastName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base"
          />
        </div>
        <div>
          <label htmlFor="business-email" className="block text-sm font-medium text-gray-700">
            Business Email*
          </label>
          <input
            type="email"
            id="business-email"
            name="businessEmail"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base"
          />
        </div>
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Telephone (Optional)
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            placeholder="+31 6 1234 5678"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base"
        ></textarea>
      </div>
      <div className="flex items-center">
        <input
          id="agree-messaging"
          name="agreeMessaging"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="agree-messaging" className="ml-2 block text-sm text-gray-900">
          I agree to receive messaging from TenderSync
        </label>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get Started
        </button>
      </div>
      {message && (
        <div className="mt-4 text-center text-sm font-medium text-green-600">
          {message}
        </div>
      )}
      <div className="text-sm text-gray-600 mt-4">
        For press and media, or to discuss speaking opportunities, drop us an email at:{' '}
        <a href="mailto:press@tendersync.com" className="text-blue-600 hover:underline">
          press@tendersync.com
        </a>
      </div>
      <div className="text-xs text-gray-500 mt-4">
        We're committed to your privacy. TenderSync uses the information you provide to us to contact you about our relevant content, products, and services. You may unsubscribe from these communications at any time. For more information, see our{' '}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        .
      </div>
    </form>
  );
};

export default ContactForm;