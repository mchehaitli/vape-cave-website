import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Vape Cave - Premium Vaping Products",
  description = "Premium vaping products and accessories at Vape Cave. Visit our convenient locations in Frisco and Arlington, TX or shop online."
}) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  // Check for age verification when component mounts
  useEffect(() => {
    const ageVerified = localStorage.getItem("age_verified");
    if (ageVerified === "true") {
      setIsVerified(true);
    }
  }, []);
  
  // Handle age verification
  const handleVerification = (verified: boolean) => {
    if (verified) {
      localStorage.setItem("age_verified", "true");
      setIsVerified(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#FF7A00" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </div>
      
      {!isVerified && (
        <AgeVerificationModal onVerify={handleVerification} />
      )}
    </>
  );
};

export default MainLayout;
