import React from "react";
import orangeLogoImage from "../assets/vapecave-logo.png";
import blackLogoImage from "../assets/vapecave-logo-black.png";

interface LogoProps {
  variant?: "orange" | "black";
  location?: "header" | "footer";
}

const Logo: React.FC<LogoProps> = ({ 
  variant = "orange", 
  location = "header" 
}) => {
  const logoSrc = variant === "orange" ? orangeLogoImage : blackLogoImage;
  
  // Different sizing based on location
  const sizeClasses = location === "header" 
    ? "h-10 md:h-12 lg:h-14 w-auto" 
    : "h-12 md:h-16 lg:h-20 w-auto";
    
  return (
    <div className="flex items-center">
      <img 
        src={logoSrc} 
        alt="Vape Cave - Smoke & Stuff" 
        className={sizeClasses}
      />
    </div>
  );
};

export default Logo;
