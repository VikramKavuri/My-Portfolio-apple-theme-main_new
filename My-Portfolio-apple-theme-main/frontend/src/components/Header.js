import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FIXED: Close menu when clicking outside or on link
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu(); // FIXED: Always close menu after clicking
    }
  };

  return (
    <>
      {/* FIXED: Header with proper z-index */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VK
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-gray-700 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('skills')} className="text-gray-700 hover:text-blue-600 transition-colors">Skills</button>
              <button onClick={() => scrollToSection('experience')} className="text-gray-700 hover:text-blue-600 transition-colors">Experience</button>
              <button onClick={() => scrollToSection('projects')} className="text-gray-700 hover:text-blue-600 transition-colors">Projects</button>
              <button onClick={() => scrollToSection('certifications')} className="text-gray-700 hover:text-blue-600 transition-colors">Certifications</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 transition-colors">Contact</button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* FIXED: Mobile Menu Overlay - Proper positioning and backdrop */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* FIXED: Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMenu}
          ></div>
          
          {/* FIXED: Menu content */}
          <div className="relative bg-white shadow-xl h-full w-64 transform transition-transform duration-300 ease-in-out">
            <div className="pt-20 pb-6 px-6">
              <nav className="space-y-4">
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('skills')} 
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Skills
                </button>
                <button 
                  onClick={() => scrollToSection('experience')} 
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Experience
                </button>
                <button 
                  onClick={() => scrollToSection('projects')} 
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Projects
                </button>
                <button 
                  onClick={() => scrollToSection('certifications')} 
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Certifications
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Contact
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
