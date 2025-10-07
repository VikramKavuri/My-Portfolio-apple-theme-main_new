import React, { useState, useEffect } from 'react';
import { ChevronDown, Database, BarChart3, Cloud, Cpu } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center px-4 sm:px-6 w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto transition-all duration-1000 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        
        {/* Name & Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl font-thin text-gray-900 mb-6 tracking-tight leading-tight">
            Thrivikrama Rao
          </h1>
          <h2 className="text-5xl font-light text-gray-900 mb-6 sm:mb-6">
            Data Enthusiastic
          </h2>
        </div>

        {/* Tagline */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Transforming raw data into strategic insights with 
            <span className="text-blue-600 font-medium"> 4+ years</span> of experience 
            across Retail, Healthcare, and Finance domains
          </p>
        </div>

        {/* Tech Icons */}
        <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 max-w-sm sm:max-w-none mx-auto">
          {[
            { icon: Database, label: 'Data Pipelines' },
            { icon: BarChart3, label: 'Analytics' },
            { icon: Cloud, label: 'Cloud Platforms' },
            { icon: Cpu, label: 'AI & ML' }
          ].map((item, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center transition-all duration-700 delay-${index * 200} transform ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-2 sm:mb-3 hover:shadow-xl transition-shadow duration-300">
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-700" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            View My Work
          </button>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Get In Touch
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToNext}
            className="animate-bounce text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
      </div>

      {/* Glass Morphism Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm"></div>
    </section>
  );
};

export default Hero;
