import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTestimonials } from '../mock/data';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const testimonialsRef = useRef(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, 1]));
          }
        });
      },
      { threshold: 0.3 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % mockTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev + 1) % mockTestimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50 scroll-mt-24" ref={testimonialsRef}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Quote className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-thin text-gray-900 mb-6">What Colleagues Say</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Testimonials from industry professionals who have worked alongside 
            and witnessed the impact of my data engineering expertise
          </p>
        </div>

        {/* Main Testimonial */}
        <div className={`transition-all duration-1000 transform ${
          visibleItems.has(1) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="relative bg-white rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto mb-16">
            
            {/* Quote Icon */}
            <div className="absolute -top-6 left-12">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {renderStars(mockTestimonials[currentTestimonial].rating)}
              </div>
              
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light italic mb-8">
                "{mockTestimonials[currentTestimonial].content}"
              </blockquote>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-center">
              <img 
                src={mockTestimonials[currentTestimonial].avatar}
                alt={mockTestimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover mr-4 shadow-lg"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-lg">
                  {mockTestimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {mockTestimonials[currentTestimonial].role}
                </div>
                <div className="text-gray-500 text-sm">
                  {mockTestimonials[currentTestimonial].company}
                </div>
              </div>
              <a 
                href={mockTestimonials[currentTestimonial].linkedIn}
                className="ml-4 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
              </a>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-3 mb-16">
          {mockTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentTestimonial(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                index === currentTestimonial ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {testimonial.content}
              </p>
              
              <div className="flex justify-between items-center">
                <a 
                  href={testimonial.linkedIn}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300"
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  View LinkedIn
                </a>
                
                <button 
                  onClick={() => setCurrentTestimonial(index)}
                  className="text-gray-400 hover:text-gray-600 text-sm transition-colors duration-300"
                >
                  Read Full
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5.0</div>
              <div className="flex justify-center mb-2">
                {renderStars(5)}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 mb-2">Recommendation Rate</div>
              <div className="text-sm text-gray-500">From colleagues</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4+</div>
              <div className="text-gray-600 mb-2">Years Recognized</div>
              <div className="text-sm text-gray-500">Excellence in delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
