import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg">{question}</span>
        <span className="ml-4 flex-shrink-0 text-blue-800">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 leading-relaxed">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What is TenderSync?",
      answer: "TenderSync is a SaaS platform that helps European SMEs find, analyze, and win public tender opportunities published on the TED (Tenders Electronic Daily) portal and other European sources."
    },
    {
      question: "How does the free trial work?",
      answer: "Our 14-day free trial gives you full access to all TenderSync features. You can monitor tender opportunities, set up alerts, and analyze market data without any commitment. No credit card required to start."
    },
    {
      question: "Do I need expertise in public procurement?",
      answer: "No, TenderSync is designed for businesses of all experience levels. Our platform simplifies the procurement process with intuitive tools, guides, and templates to help you navigate tender opportunities effectively."
    },
    {
      question: "What types of tenders can I find on TenderSync?",
      answer: "TenderSync covers all public tenders published in the EU, EEA, and associated countries, spanning sectors like construction, IT, healthcare, consulting, and many more. Our smart filtering helps you find the most relevant opportunities."
    },
    {
      question: "Can I integrate TenderSync with my existing tools?",
      answer: "Yes, TenderSync offers API access and integrations with popular CRM and project management tools. This allows you to seamlessly incorporate tender data into your existing workflows."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about our tender intelligence platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;