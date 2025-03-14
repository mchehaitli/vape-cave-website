import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img 
        src="/vapecave-logo.png" 
        alt="Vape Cave - Smoke & Stuff" 
        className="h-14 md:h-16 w-auto"
      />
    </div>
  );
};

export default Logo;
