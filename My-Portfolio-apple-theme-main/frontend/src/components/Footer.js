import React from 'react';
import { ArrowUp, Linkedin, Github, Mail, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Certifications', href: '#certifications' }
  ];

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://linkedin.com/in/thrivikramarao-kavuri-7290b6147',
      color: 'hover:text-blue-600'
    },
    { 
      name: 'GitHub', 
      icon: Github, 
      href: 'https://github.com/VikramKavuri',
      color: 'hover:text-gray-900'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      href: 'mailto:thrivikr@buffalo.edu',
      color: 'hover:text-red-600'
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* About Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-2">Thrivikrama Rao</h3>
                <p className="text-gray-400 text-lg">Data Engineer</p>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Transforming complex data challenges into strategic business advantages. 
                Specializing in scalable data pipelines, cloud architecture, and analytics solutions 
                that drive informed decision-making.
              </p>
              <div className="flex items-center text-gray-400">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span>Open to new opportunities</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Let's Connect</h4>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-gray-400 text-sm">Email</div>
                  <a 
                    href="mailto:thrivikr@buffalo.edu"
                    className="text-white hover:text-blue-400 transition-colors duration-300"
                  >
                    thrivikr@buffalo.edu
                  </a>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white">Buffalo, NY</div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              
              {/* Copyright */}
              <div className="flex items-center text-gray-400 mb-4 md:mb-0">
                <span>© {currentYear} Thrivikrama Rao. Built with</span>
                <Heart className="w-4 h-4 mx-2 text-red-500 fill-current" />
                <span>and React</span>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;