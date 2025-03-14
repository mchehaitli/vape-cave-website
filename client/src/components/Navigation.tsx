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
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="logo-container" onClick={() => window.location.href = "/"}>
            <Logo />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="menu-toggle"
            className="md:hidden text-black focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 font-['Poppins'] font-medium">
              {navItems.map((item) => (
                <li key={item.path}>
                  <div onClick={() => window.location.href = item.path} className="cursor-pointer">
                    <span className={`text-black hover:text-white transition-colors ${
                      location === item.path 
                        ? 'font-bold after:block after:w-full after:h-0.5 after:bg-black after:mt-1' 
                        : ''
                    }`}>
                      {item.label}
                    </span>
                  </div>
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
              onClick={() => {
                window.location.href = item.path;
                setMobileMenuOpen(false);
              }}
            >
              <div className="block text-black cursor-pointer">
                {item.label}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
