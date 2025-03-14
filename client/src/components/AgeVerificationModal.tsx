import React, { useState } from "react";
import Logo from "./Logo";

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 border-2 border-primary">
        <div className="mb-6 flex justify-center">
          <Logo variant="orange" location="footer" />
        </div>
        
        <div className="text-center mb-6">
          <h3 className="font-['Poppins'] font-bold text-2xl mb-3">Age Verification</h3>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="mb-3">You must be at least 21 years old to enter this website. Please verify your age to continue.</p>
        </div>
        
        {showWarning && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>Sorry, you must be 21 or older to access this website.</span>
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <button 
            onClick={() => handleVerify(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            I am 21 or older
          </button>
          <button 
            onClick={() => handleVerify(false)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            I am under 21
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          By entering this site, you are confirming that you are of legal age to purchase vaping products in your location.
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
