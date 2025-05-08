import React from 'react';
import Button from './ui/Button';

type PrimaryCTAProps = {
  onClick?: () => void;
};

const PrimaryCTA: React.FC<PrimaryCTAProps> = ({ onClick }) => {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      className="shadow-lg hover:shadow-xl"
    >
      <span className="flex items-center">
        Start Free Trial
        <svg 
          className="ml-2 -mr-1 w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
            clipRule="evenodd"
          />
        </svg>
      </span>
    </Button>
  );
};

export default PrimaryCTA;