import React from "react";

interface AgeVerificationModalProps {
  onVerify: (isVerified: boolean) => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerify }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-primary text-4xl mb-4"></i>
          <h3 className="font-['Poppins'] font-bold text-2xl mb-3">Age Verification</h3>
          <p className="mb-6">You must be at least 21 years old to enter this website. Please verify your age to continue.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => onVerify(true)}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-md transition-colors"
            >
              I am 21 or older
            </button>
            <button 
              onClick={() => onVerify(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-dark font-bold py-3 px-6 rounded-md transition-colors"
            >
              I am under 21
            </button>
          </div>
          
          <p className="mt-6 text-sm text-dark/70">
            By entering this site, you are confirming that you are of legal age to purchase vaping products in your location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
