import React from "react";
import logoSvg from "../assets/vapecave-logo.svg";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img 
        src={logoSvg} 
        alt="Vape Cave - Smoke & Stuff" 
        className="h-14 md:h-16 w-auto"
      />
    </div>
  );
};

export default Logo;
