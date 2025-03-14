import React from "react";
import logoImage from "../assets/vapecave-logo.png";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img 
        src={logoImage} 
        alt="Vape Cave - Smoke & Stuff" 
        className="h-20 md:h-24 lg:h-28 w-auto"
      />
    </div>
  );
};

export default Logo;
