import React, { useState, useEffect, useRef } from 'react';
import { Code, Cloud, Database, BarChart3, Zap, Award } from 'lucide-react';
import { mockSkills } from '../mock/data';

const Skills = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const skillsRef = useRef(null);

  // FIXED: Add activeCategory to visibleItems when tab is clicked
  useEffect(() => {
    if (isTabClicked) {
      setVisibleItems(prev => new Set([...prev, activeCategory]));
      setIsTabClicked(false);
    }
  }, [activeCategory, isTabClicked]);

  // FIXED: Initialize first category as visible on component mount
  useEffect(() => {
    setVisibleItems(new Set([0]));
  }, []);

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
      { threshold: 0.1 } // FIXED: Reduced threshold for better detection
    );

    const items = skillsRef.current?.querySelectorAll('[data-id]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Programming Languages': return Code;
      case 'Cloud Platforms': return Cloud;
      case 'Data Tools & Technologies': return BarChart3;
      case 'Databases': return Database;
      default: return Zap;
    }
  };

  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600'
    ];
    return colors[index % colors.length];
  };

  // FIXED: Handle tab click with immediate visibility
  const handleCategoryClick = (index) => {
    setActiveCategory(index);
    setIsTabClicked(true);
    // FIXED: Force immediate visibility
    setVisibleItems(prev => new Set([...prev, index]));
  };

  return (
    <section id="skills" className="py-24 bg-gray-50 scroll-mt-24" ref={skillsRef}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-thin text-gray-900 mb-6">Technical Excellence</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Comprehensive expertise across the modern data engineering stack, 
            from cloud platforms to machine learning frameworks
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-16 bg-white rounded-2xl p-2 shadow-lg">
          {mockSkills.technical.map((category, index) => {
            const IconComponent = getCategoryIcon(category.category);
            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(index)} // FIXED: Use new handler
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-1 mb-2 ${
                  activeCategory === index
                    ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">{category.category}</span>
                <span className="sm:hidden">{category.category.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="mb-16">
          <div 
            data-id={activeCategory}
            className={`transition-all duration-700 transform ${
              visibleItems.has(activeCategory) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSkills.technical[activeCategory].skills.map((skill, index) => (
                <div
                  key={`${activeCategory}-${index}`} // FIXED: Better key for re-rendering
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {skill.iconType === 'image' ? (
                          <img src={skill.icon} alt={skill.name} className="w-8 h-8 mr-2" />
                        ) : (
                          <span className="text-xl mr-2">{skill.icon}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                    </div>
                    <div className="text-sm font-medium text-gray-500">{skill.level}%</div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getCategoryColor(activeCategory)} rounded-full transition-all duration-1000 ease-out transform origin-left`}
                        style={{ 
                          width: visibleItems.has(activeCategory) ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 100 + 300}ms`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Proficiency Label */}
                  <div className="mt-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      skill.level >= 90 ? 'bg-green-100 text-green-700' :
                      skill.level >= 80 ? 'bg-blue-100 text-blue-700' :
                      skill.level >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {skill.level >= 90 ? 'Expert' :
                       skill.level >= 80 ? 'Advanced' :
                       skill.level >= 70 ? 'Proficient' : 'Intermediate'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Summary */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Technical Proficiency</h3>
            <p className="text-gray-600">Expertise across the entire data engineering lifecycle</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">6+</div>
              <div className="text-gray-600 text-sm">Languages</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Cloud className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
              <div className="text-gray-600 text-sm">Cloud Platforms</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">10+</div>
              <div className="text-gray-600 text-sm">Data Tools</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Database className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
              <div className="text-gray-600 text-sm">Database Systems</div>
            </div>
          </div>
        </div>

        {/* Expertise Areas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Data Engineering",
              description: "ETL pipelines, data warehousing, real-time processing",
              icon: Database,
              color: "blue"
            },
            {
              title: "Cloud Architecture", 
              description: "AWS, Azure, scalable infrastructure design",
              icon: Cloud,
              color: "purple"
            },
            {
              title: "Analytics & ML",
              description: "Business intelligence, predictive modeling, insights",
              icon: BarChart3,
              color: "green"
            }
          ].map((area, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center"
            >
              <div className={`w-20 h-20 bg-${area.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <area.icon className={`w-10 h-10 text-${area.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.title}</h3>
              <p className="text-gray-600">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
