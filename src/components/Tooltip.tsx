
import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
