import React, { useState } from "react";
import specialLogo from "../assets/vapecave-logo-special.png";

interface AgeVerificationModalProps {
  onVerify: (isVerified: boolean) => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerify }) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleVerify = (verified: boolean) => {
    if (verified) {
      onVerify(true);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-black rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 md:p-8 border-2 border-primary relative">
        <div className="mb-6 flex justify-center">
          <img 
            src={specialLogo} 
            alt="Vape Cave - Smoke & Stuff" 
            className="h-44 md:h-52 lg:h-60 w-auto" 
          />
        </div>
        
        <div className="text-center mb-6">
          <h3 className="font-['Poppins'] font-bold text-2xl mb-3 text-white">Age Verification</h3>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="mb-3 text-gray-300">You must be at least 21 years old to enter this website. Please verify your age to continue.</p>
        </div>
        
        {showWarning && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-800 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>Sorry, you must be 21 or older to access this website.</span>
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <button 
            onClick={() => handleVerify(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              I am 21 or older
            </span>
          </button>
          <button 
            onClick={() => handleVerify(false)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow"
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              I am under 21
            </span>
          </button>
        </div>
        
        <p className="text-xs text-gray-400 text-center">
          By entering this site, you are confirming that you are of legal age to purchase vaping products in your location.
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
