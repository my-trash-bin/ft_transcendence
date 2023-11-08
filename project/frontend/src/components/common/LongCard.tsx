import React from 'react';

interface LongCardProps {
  children: React.ReactNode;
  isUser: boolean;
}

const LongCard: React.FC<LongCardProps> = ({ children, isUser }) => {
  const bgCSS = isUser ? 'bg-default-interactive ' : 'bg-white-interactive';
  const size = isUser ? 'my-xl h-ms' : 'mx-auto mb-lg h-[60px]';
  const borderCSS = isUser
    ? 'border-dark-purple-interactive '
    : 'border-gray-interactive';

  const commonCSS = 'w-[600px] rounded-md p-md border-3 relative';
  const textCSS = 'text-dark-gray-interactive font-semibold text-h2';
  const alignCSS = 'flex items-center';
  const hoverCSS =
    'cursor-pointer transition-all duration-300 ease-in-out hover:shadow-custom hover:-translate-y-[0.148rem]';

  return (
    <div
      className={`${commonCSS} ${textCSS} ${alignCSS} ${borderCSS} ${hoverCSS} ${size} ${bgCSS}`}
    >
      {children}
    </div>
  );
};

export default LongCard;
