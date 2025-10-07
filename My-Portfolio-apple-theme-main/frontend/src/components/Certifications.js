import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, CheckCircle, Calendar, Award, Star } from 'lucide-react';
import { mockCertifications } from '../mock/data';

const Certifications = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const certificationsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.dataset.id);
            setVisibleItems(prev => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = certificationsRef.current?.querySelectorAll('[data-id]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="certifications" className="py-24 bg-white scroll-mt-24" ref={certificationsRef}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-thin text-gray-900 mb-6">Certifications & Achievements</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Industry-recognized certifications validating expertise in 
            cutting-edge data technologies and platforms
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mockCertifications.map((cert, index) => (
            <div
              key={cert.id}
              data-id={cert.id}
              className={`group transition-all duration-1000 transform ${
                visibleItems.has(cert.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mr-4 shadow-lg">
                      <img 
                        src={cert.logo}
                        alt={cert.issuer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {cert.name}
                      </h3>
                      <p className="text-gray-600 font-medium">{cert.issuer}</p>
                    </div>
                  </div>
                  
                  {cert.verified && (
                    <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mb-6">
                  <div className="flex items-center text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Earned in {cert.date}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      This certification validates advanced skills in {cert.name.toLowerCase()} 
                      and demonstrates proficiency in industry-standard practices and technologies.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-gray-600 text-sm">Industry Recognized</span>
                  </div>
                  
                  <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 group">
                    <span>View Credential</span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Professional Achievements</h3>
            <p className="text-gray-600">Continuous learning and professional development milestones</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4+</div>
              <div className="text-gray-600">Certifications</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Verified</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
              <div className="text-gray-600">Major Platforms</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2024</div>
              <div className="text-gray-600">Latest Cert</div>
            </div>
          </div>
        </div>

        {/* Skills Validation */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">Validated Skills</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These certifications validate proficiency across the modern data engineering stack
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Microsoft Fabric", "Azure SQL", "Python", "Data Engineering", 
              "Machine Learning", "Cloud Architecture", "Oracle Cloud", "Generative AI",
              "Data Science", "ETL Pipelines", "Data Governance", "Analytics"
            ].map((skill, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                <div className="text-sm font-medium text-gray-700">{skill}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
