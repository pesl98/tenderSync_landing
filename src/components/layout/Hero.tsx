
import React from 'react';
import PrimaryCTA from '../PrimaryCTA';

const Hero = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 z-0" />
      
      <div className="absolute right-0 top-1/4 w-2/3 h-64 bg-blue-200 opacity-20 rounded-full filter blur-3xl z-0" />
      <div className="absolute -left-20 top-1/2 w-64 h-64 bg-teal-200 opacity-20 rounded-full filter blur-3xl z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6 animate-fade-in">
            Unlock <span className="text-blue-800">European Tenders</span> for Your Business
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
            Get ahead of your competition with real-time access to EU tender opportunities tailored for your business.
          </p>
          <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
            <PrimaryCTA onClick={onOpenModal} />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-gray-700 font-medium">
              <span>Call us: </span>
              <a href="tel:+31623374143" className="hover:text-blue-800 transition-colors">
                +31 6 233 74 143
              </a>
            </div>
            <div className="flex justify-center items-center text-gray-600 text-sm font-medium">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="mx-4">•</span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14-day free trial
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
