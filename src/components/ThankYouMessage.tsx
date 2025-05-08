import React from 'react';
import { CheckCircle } from 'lucide-react';

type ThankYouMessageProps = {
  companyName: string;
};

const ThankYouMessage: React.FC<ThankYouMessageProps> = ({ companyName = 'TenderSync' }) => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <CheckCircle size={56} className="text-green-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Thank You for Your Interest!
      </h3>
      
      <p className="text-gray-600 mb-6">
        Thanks for requesting a trial to <span className="font-semibold">{companyName}</span>. 
        We will review your request and get back to you within 24 hours.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 mb-6">
        <p className="font-medium">Next steps:</p>
        <ul className="text-left text-sm mt-2 space-y-2">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Check your email for a confirmation message
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Our team will contact you to arrange a demonstration
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            You'll receive your login credentials to start your free trial
          </li>
        </ul>
      </div>
      
      <p className="text-sm text-gray-500">
        Have questions? Contact our support team at <a href="mailto:support@tendersync.com" className="text-blue-600 hover:underline">support@tendersync.com</a>
      </p>
    </div>
  );
};

export default ThankYouMessage;