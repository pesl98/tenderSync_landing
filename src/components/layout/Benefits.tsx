import React from 'react';
import { Search, BarChart3, BellRing } from 'lucide-react';

type BenefitCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-800 rounded-lg mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Search size={28} />,
      title: "Smart Tender Matching",
      description: "Advanced AI algorithms find relevant tenders that match your business profile and expertise.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Competitive Analysis",
      description: "Gain insights into tender awards and analyze competitors to craft winning proposals.",
    },
    {
      icon: <BellRing size={28} />,
      title: "Real-time Alerts",
      description: "Never miss an opportunity with instant notifications for new tenders in your industry.",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TenderSync
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform gives you the competitive edge in the European tender market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;