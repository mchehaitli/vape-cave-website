import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  // Listen for scroll events to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add offset for header height

      // Find all section elements
      const sections = document.querySelectorAll('section[id]');
      
      // Find the current section in view
      let currentSection: string | null = null;
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSection = section.id;
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { label: "Home", path: "/", ariaLabel: "Go to homepage" },
    { label: "Products", path: "/products", ariaLabel: "Browse our products" },
    { label: "Frisco Store", path: "/locations/frisco", ariaLabel: "Visit our Frisco TX location" },
    { label: "Arlington Store", path: "/locations/arlington", ariaLabel: "Visit our Arlington TX location" },
    { label: "Blog", path: "/blog", ariaLabel: "Read our blog" },
    { label: "Contact", path: "/contact", ariaLabel: "Contact us" },
  ];
  
  // Scroll navigation items (only show on homepage)
  const scrollNavItems: Array<{label: string, sectionId: string, ariaLabel: string}> = [];

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with improved accessibility */}
          <Link href="/">
            <div className="logo-container cursor-pointer" role="img" aria-label="Vape Cave Logo - Go to homepage">
              <Logo variant="black" location="header" />
            </div>
          </Link>

          {/* Mobile Menu Toggle with improved accessibility */}
          <button
            id="menu-toggle"
            className="md:hidden text-black focus:outline-none focus:ring-2 focus:ring-black/20 rounded-md"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation with Semantic Structure */}
          <nav className="hidden md:block" aria-label="Main Navigation">
            <ul className="flex space-x-8 font-['Poppins'] font-medium" role="menubar">
              {navItems.map((item) => (
                <li key={item.path} role="none">
                  <Link href={item.path}>
                    <span
                      role="menuitem"
                      aria-label={item.ariaLabel}
                      aria-current={location === item.path ? "page" : undefined}
                      className={`text-black hover:text-white transition-colors cursor-pointer font-medium relative ${
                        location === item.path 
                          ? 'font-bold after:block after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-black'
                          : 'after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-black hover:after:w-full after:transition-all after:duration-300'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Scroll Navigation (only on homepage) */}
        {location === "/" && scrollNavItems.length > 0 && (
          <div className="scroll-nav-container pt-2 pb-1 border-t border-black/10 mt-2">
            <div className="container mx-auto">
              <nav aria-label="Page Section Navigation">
                <ul className="flex flex-wrap justify-center space-x-3 text-sm">
                  {scrollNavItems.map((item) => (
                    <li key={item.sectionId}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.sectionId)}
                        className={`px-3 py-1 rounded-full transition-all duration-300 ${
                          activeSection === item.sectionId 
                            ? 'bg-black text-white font-medium shadow-md transform scale-105' 
                            : 'bg-black/5 text-black hover:bg-black/10'
                        }`}
                        aria-label={item.ariaLabel}
                        aria-current={activeSection === item.sectionId ? "location" : undefined}
                      >
                        {activeSection === item.sectionId && (
                          <span className="inline-block mr-1">•</span>
                        )}
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation with Improved Accessibility */}
      <div 
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile Navigation"
        className={`md:hidden bg-primary border-t border-black/20 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-3 font-['Poppins'] font-medium">
          <ul className="mb-2" role="menu">
            {navItems.map((item, index) => (
              <li 
                key={item.path} 
                role="none"
                className={index < navItems.length - 1 ? "py-2 border-b border-black/10" : "py-2"}
              >
                <Link href={item.path}>
                  <span
                    role="menuitem"
                    aria-label={item.ariaLabel}
                    aria-current={location === item.path ? "page" : undefined}
                    className="block text-black cursor-pointer hover:text-white/90 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Mobile Scroll Navigation (only on homepage) */}
          {location === "/" && scrollNavItems.length > 0 && (
            <div className="pt-2 border-t border-black/10">
              <h3 className="text-xs font-semibold text-black/70 mb-2">Jump to section:</h3>
              <ul className="flex flex-wrap gap-2" role="menu">
                {scrollNavItems.map((item) => (
                  <li key={item.sectionId} role="none">
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.sectionId)}
                      className={`text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                        activeSection === item.sectionId 
                          ? 'bg-black text-white font-medium shadow-md' 
                          : 'bg-black/5 text-black hover:bg-black/10'
                      }`}
                      aria-label={item.ariaLabel}
                    >
                      {activeSection === item.sectionId && (
                        <span className="inline-block mr-1">•</span>
                      )}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
