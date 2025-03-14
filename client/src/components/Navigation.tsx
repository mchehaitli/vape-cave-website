import { useState } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Locations", path: "/locations" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="logo-container cursor-pointer">
              <Logo variant="black" location="header" />
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="menu-toggle"
            className="md:hidden text-black focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 font-['Poppins'] font-medium">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <span className={`text-black hover:text-white transition-colors cursor-pointer ${
                      location === item.path 
                        ? 'font-bold after:block after:w-full after:h-0.5 after:bg-black after:mt-1' 
                        : ''
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden bg-primary border-t border-black/20 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="container mx-auto px-4 py-3 font-['Poppins'] font-medium">
          {navItems.map((item, index) => (
            <li 
              key={item.path} 
              className={index < navItems.length - 1 ? "py-2 border-b border-black/10" : "py-2"}
            >
              <Link href={item.path}>
                <span 
                  className="block text-black cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
