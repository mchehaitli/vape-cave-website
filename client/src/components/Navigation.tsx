import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event for navbar background effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-bg/95 py-2 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="logo-container cursor-pointer">
              <Logo variant="orange" location="header" />
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="menu-toggle"
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 font-medium">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <span className={`nav-link text-base ${
                      location === item.path 
                        ? 'text-orange-primary' 
                        : 'text-white'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href="tel:+14692940061" 
                  className="px-4 py-1.5 bg-orange-primary text-dark-bg rounded-md font-semibold text-sm hover:bg-orange-light transition-colors duration-200"
                >
                  CALL NOW
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden bg-dark-surface/95 backdrop-blur-sm border-t border-gray-800 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="container mx-auto px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span 
                  className={`block py-2 nav-link ${
                    location === item.path ? 'text-orange-primary' : 'text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
          <li className="pt-4 border-t border-gray-800">
            <a 
              href="tel:+14692940061" 
              className="block w-full text-center px-4 py-3 bg-orange-primary text-dark-bg rounded-md font-semibold hover:bg-orange-light transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              CALL NOW
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
