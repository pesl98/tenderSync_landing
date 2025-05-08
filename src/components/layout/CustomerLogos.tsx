import React from 'react';

const CustomerLogos = () => {
  // Placeholder logo URLs - in a real implementation, these would be served from your assets
  const logos = [
    {
      name: 'Company 1',
      url: 'https://images.pexels.com/photos/5439167/pexels-photo-5439167.jpeg?auto=compress&cs=tinysrgb&w=200',
      alt: 'Company 1 logo'
    },
    {
      name: 'Company 2',
      url: 'https://images.pexels.com/photos/5439163/pexels-photo-5439163.jpeg?auto=compress&cs=tinysrgb&w=200',
      alt: 'Company 2 logo'
    },
    {
      name: 'Company 3',
      url: 'https://images.pexels.com/photos/5849592/pexels-photo-5849592.jpeg?auto=compress&cs=tinysrgb&w=200',
      alt: 'Company 3 logo'
    },
    {
      name: 'Company 4',
      url: 'https://images.pexels.com/photos/5849564/pexels-photo-5849564.jpeg?auto=compress&cs=tinysrgb&w=200',
      alt: 'Company 4 logo'
    },
    {
      name: 'Company 5',
      url: 'https://images.pexels.com/photos/7454767/pexels-photo-7454767.jpeg?auto=compress&cs=tinysrgb&w=200',
      alt: 'Company 5 logo'
    },
  ];

  return (
    <section id="customers" className="py-16 border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Trusted by European SMEs across all industries
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 opacity-70">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <img 
                src={logo.url} 
                alt={logo.alt} 
                className="h-10 md:h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerLogos;