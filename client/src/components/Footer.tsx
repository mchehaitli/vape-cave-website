import { Link } from "wouter";
import { useState } from "react";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the email to a backend service
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="footer py-16">
      <div className="container mx-auto px-6">  
        <div className="flex flex-col md:flex-row justify-between mb-16">
          <div className="mb-10 md:mb-0">
            <Logo variant="orange" location="footer" />
            <p className="text-light-gray mt-6 max-w-sm">
              Your one-stop destination for premium vaping products and accessories. Serving the Texas area with two convenient locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 lg:gap-24">
            {/* Social Media Links */}
            <div>
              <h4 className="text-light-text font-bold text-lg mb-6">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center text-light-gray hover:text-orange transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center text-light-gray hover:text-orange transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center text-light-gray hover:text-orange transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-light-text font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/">
                    <span className="text-light-gray hover:text-orange transition-colors cursor-pointer">Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/products">
                    <span className="text-light-gray hover:text-orange transition-colors cursor-pointer">Products</span>
                  </Link>
                </li>
                <li>
                  <Link href="/locations">
                    <span className="text-light-gray hover:text-orange transition-colors cursor-pointer">Locations</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <span className="text-light-gray hover:text-orange transition-colors cursor-pointer">Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Store Hours */}
            <div>
              <h4 className="text-light-text font-bold text-lg mb-6">Store Hours</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-orange mb-1">Frisco</p>
                  <p className="text-light-gray text-sm">Mon-Thu: 10:00 AM - 12:00 AM</p>
                  <p className="text-light-gray text-sm">Fri-Sat: 10:00 AM - 1:00 AM</p>
                  <p className="text-light-gray text-sm">Sun: 10:00 AM - 12:00 AM</p>
                </div>
                <div>
                  <p className="font-medium text-orange mb-1">Arlington</p>
                  <p className="text-light-gray text-sm">Daily: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 border-t border-gray-800">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+14692940061" className="text-light-gray hover:text-orange transition-colors">(469) 294-0061 (Frisco)</a>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+16822700334" className="text-light-gray hover:text-orange transition-colors">(682) 270-0334 (Arlington)</a>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:vapecavetex@gmail.com" className="text-light-gray hover:text-orange transition-colors">vapecavetex@gmail.com</a>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-light-gray/70 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Vape Cave. All rights reserved.</p>
          <div className="space-x-6">
            <span className="text-light-gray/70 hover:text-orange transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-light-gray/70 hover:text-orange transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-light-gray/70 hover:text-orange transition-colors cursor-pointer">Age Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
