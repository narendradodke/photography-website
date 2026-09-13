import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-[#141414] dark:bg-[#141414] light:bg-white
        ${bordered ? 'border border-[#262626] dark:border-[#262626] light:border-[#E0E0E0]' : ''}
        ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-black/40' : ''}
        p-6 sm:p-8
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
