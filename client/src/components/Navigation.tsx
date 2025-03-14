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
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <a className="block">
              <Logo />
            </a>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="menu-toggle"
            className="md:hidden text-black focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 font-['Poppins'] font-medium">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a className={`text-black hover:text-white transition-colors ${location === item.path ? 'font-bold' : ''}`}>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`md:hidden bg-primary border-t border-black/20 ${mobileMenuOpen ? '' : 'hidden'}`}>
        <ul className="container mx-auto px-4 py-3 font-['Poppins'] font-medium">
          {navItems.map((item, index) => (
            <li key={item.path} className={index < navItems.length - 1 ? "py-2 border-b border-black/10" : "py-2"}>
              <Link href={item.path}>
                <a className="block text-black" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
