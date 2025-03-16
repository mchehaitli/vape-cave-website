import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HomePage from "@/pages/HomePage";
import LocationsPage from "@/pages/LocationsPage";
import FriscoLocationPage from "@/pages/FriscoLocationPage";
import ArlingtonLocationPage from "@/pages/ArlingtonLocationPage";
import ContactPage from "@/pages/ContactPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import PageTransition from "@/components/PageTransition";

// Custom hook to scroll to top on route changes with smooth animation
function useScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);
  
  return null;
}

function Router() {
  // Use the scroll-to-top hook
  useScrollToTop();
  
  // Get current location for AnimatePresence
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/locations" component={LocationsPage} />
          <Route path="/locations/frisco" component={FriscoLocationPage} />
          <Route path="/locations/arlington" component={ArlingtonLocationPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogPostPage} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified");
    if (!ageVerified) {
      setShowAgeVerification(true);
    }
  }, []);

  const handleVerifyAge = (isVerified: boolean) => {
    if (isVerified) {
      localStorage.setItem("ageVerified", "true");
      setShowAgeVerification(false);
    } else {
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      {showAgeVerification && <AgeVerificationModal onVerify={handleVerifyAge} />}
    </QueryClientProvider>
  );
}

export default App;
