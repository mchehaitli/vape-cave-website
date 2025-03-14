import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Vape Cave - Smoke & Stuff",
  description = "Premium vaping products and accessories at Vape Cave. Visit our two convenient locations or shop online."
}) => {
  // Update document title and meta description
  React.useEffect(() => {
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
    
    // Update OG meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }
    
    if (ogDescription) {
      ogDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return (
    <div className="flex flex-col min-h-screen font-['Open_Sans'] text-dark bg-light">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
