import { Link } from "wouter";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the email to a backend service
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h4 className="font-['Poppins'] font-semibold text-xl mb-4">About Vape Cave</h4>
            <p className="text-white/70 mb-4">
              Vape Cave is your premier destination for high-quality vaping products and expert advice. 
              We pride ourselves on offering exceptional service and a wide selection of premium products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-['Poppins'] font-semibold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-white/70 hover:text-primary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-white/70 hover:text-primary transition-colors">Products</a>
                </Link>
              </li>
              <li>
                <Link href="/locations">
                  <a className="text-white/70 hover:text-primary transition-colors">Locations</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-white/70 hover:text-primary transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary transition-colors">FAQs</a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-['Poppins'] font-semibold text-xl mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                <span className="text-white/70">123 Main Street, City A</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                <span className="text-white/70">456 Oak Avenue, City B</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt text-primary mt-1 mr-3"></i>
                <span className="text-white/70">555-123-4567 (City A)</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt text-primary mt-1 mr-3"></i>
                <span className="text-white/70">555-987-6543 (City B)</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope text-primary mt-1 mr-3"></i>
                <span className="text-white/70">info@vapecave.com</span>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-['Poppins'] font-semibold text-xl mb-4">Stay Updated</h4>
            <p className="text-white/70 mb-4">
              Subscribe to our newsletter for the latest products, promotions, and vaping news.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <div>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-primary text-dark"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2 px-6 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-center md:flex md:justify-between md:text-left">
          <p className="text-white/70 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Vape Cave. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="text-white/70 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-white/70 hover:text-primary transition-colors">Age Verification</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
