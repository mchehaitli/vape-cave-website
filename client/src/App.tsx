import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import HomePage from "@/pages/HomePage";
import LocationsPage from "@/pages/LocationsPage";
import FriscoLocationPage from "@/pages/FriscoLocationPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";
import AgeVerificationModal from "@/components/AgeVerificationModal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/locations" component={LocationsPage} />
      <Route path="/locations/frisco" component={FriscoLocationPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
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
