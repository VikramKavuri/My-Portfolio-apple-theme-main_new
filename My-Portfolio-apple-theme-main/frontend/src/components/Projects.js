import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Play, Database, Brain, TrendingUp, Code, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const projectsRef = useRef(null);

  // Your 7 projects
  const projects = [
    {
      id: 1,
      title: "Telecom Customer Churn Prediction",
      category: "Machine Learning",
      description: "Predicted telecom customer churn with 87% accuracy using ML models, enabling proactive retention strategies that can save millions in revenue.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
      technologies: ["Python", "Scikit-learn", "XGBoost", "Flask", "Pandas"],
      features: [
        "Processed 7,000+ telecom customer records with 33 features",
        "Benchmarked 6 ML algorithms, achieving 87% accuracy",
        "Balanced class distribution using SMOTE",
        "Deployed Flask web app for real-time churn predictions",
        "Provided actionable insights for retention campaigns"
      ],
      metrics: [
        { label: "Accuracy", value: "87%" },
        { label: "Records", value: "7K+" },
        { label: "Revenue Impact", value: "$1.6M" }
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/VikramKavuri/Teleco-Customer-Churn-Prediction"
    },
    {
      id: 2,
      title: "Real-time CPU Monitoring Dashboard",
      category: "Business Intelligence",
      description: "Developed a lightweight Power BI solution to monitor Windows system health in real-time without costly Azure infrastructure.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      technologies: ["Power BI", "PowerShell", "REST API", "Windows"],
      features: [
        "Streams CPU, memory, disk, and network usage in real-time",
        "Second-level refresh for live dashboards",
        "PushStreaming dataset with REST API integration",
        "Tracks 15+ system metrics including temperature",
        "Customizable monitoring for IT administrators"
      ],
      metrics: [
        { label: "Update Speed", value: "1s" },
        { label: "Metrics", value: "15+" },
        { label: "Infra Cost", value: "$0" }
      ],
      demoUrl: "https://app.powerbi.com/links/OdX0WyqgcH",
      githubUrl: "https://github.com/VikramKavuri/Power-BI-Realtime-CPU-monitoring-dashboard"
    },
    {
      id: 3,
      title: "Retail Data Migration",
      category: "Data Engineering",
      description: "Migrated on-premise retail ERP data to Azure cloud, enabling real-time dashboards and reducing reporting latency from hours to seconds.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
      technologies: ["Azure Data Factory", "Databricks", "Synapse", "Power BI", "Delta Lake"],
      features: [
        "Extracted 10+ tables from on-prem SQL Server",
        "Implemented Bronze-Silver-Gold medallion architecture",
        "Automated ETL pipelines with dynamic table discovery",
        "Delivered interactive Power BI dashboards",
        "Secured sensitive data with Azure Key Vault"
      ],
      metrics: [
        { label: "Records", value: "5K+" },
        { label: "Latency Cut", value: "99.9%" },
        { label: "Automation", value: "Full" }
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/VikramKavuri/On-prem-to-Cloud-Migration---Azure"
    },
    {
      id: 4,
      title: "Regional Hardware Sales Analysis",
      category: "Business Intelligence",
      description: "Built Tableau dashboards to analyze hardware sales across Indian markets, uncovering revenue trends and profitability insights.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      technologies: ["Tableau", "SQL", "MySQL", "Excel"],
      features: [
        "Automated ETL with SQL into star schema",
        "Interactive Tableau dashboards for revenue & profit",
        "Identified top customers, products, and markets",
        "Replaced manual Excel reporting with real-time BI",
        "Scalable model supporting multiple data sources"
      ],
      metrics: [
        { label: "Dashboards", value: "2+" },
        { label: "Markets", value: "10+" },
        { label: "Data Model", value: "Star" }
      ],
      demoUrl: "https://public.tableau.com/views/SalesInsights-DataAnalysisProject/",
      githubUrl: "https://github.com/VikramKavuri/Sales-Insights---Data-Analysis-using-Tableau-SQL"
    },
    {
      id: 5,
      title: "Real-Time E-Commerce Pipeline",
      category: "Data Engineering",
      description: "Implemented a scalable data pipeline processing 100K+ e-commerce order events per second with sub-second insights.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
      technologies: ["AWS Kinesis", "Apache Airflow", "Snowflake", "Python"],
      features: [
        "Captured and processed millions of customer order events",
        "Automated ETL workflows with Apache Airflow",
        "Real-time delivery into Snowflake warehouse",
        "Implemented auto-scaling and error recovery",
        "Enabled instant BI reporting and anomaly detection"
      ],
      metrics: [
        { label: "Events/sec", value: "100K+" },
        { label: "Latency", value: "<1s" },
        { label: "Uptime", value: "99.9%" }
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/VikramKavuri/Real-Time-Data-Pipeline"
    },
    {
      id: 6,
      title: "Healthcare FHIR Data to Patient Risk",
      category: "Machine Learning",
      description: "Converted complex FHIR healthcare records into patient risk dashboards and predictive models with 92% accuracy.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
      technologies: ["Databricks", "Apache Spark", "Python", "FHIR", "MLflow"],
      features: [
        "Automated ingestion of FHIR healthcare bundles",
        "Flattened nested JSON into SQL-ready tables",
        "Created Patient-360 views with Delta Lake",
        "Trained ML models with explainable SHAP outputs",
        "Enabled proactive risk detection and prevention"
      ],
      metrics: [
        { label: "Accuracy", value: "92%" },
        { label: "Speed", value: "90% ↑" },
        { label: "Cost Save", value: "90%" }
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/VikramKavuri/Accelerating-Interoperability-with-Databricks-Lakehouse"
    },
    {
      id: 7,
      title: "Job Search Automation with MCP",
      category: "Automation",
      description: "Built an automation agent using MCP server to scrape, classify, and centralize job postings for Data roles.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80",
      technologies: ["Python", "MCP Server", "Logging", "Excel"],
      features: [
        "Automated scraping of multiple job portals",
        "Classified Data Engineering & Analytics roles",
        "Implemented retry logic with error logging",
        "Stored structured job data into Excel sheets",
        "Created centralized repository for job search"
      ],
      metrics: [
        { label: "Sites", value: "4+" },
        { label: "Retries", value: "3" },
        { label: "Logs", value: "100%" }
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/VikramKavuri/Jobsearch_using_MCP_server"
    }
  ];

  // Extract all unique technologies for filter tags
  const getAllTechnologies = () => {
    const techSet = new Set();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return ["All", ...Array.from(techSet).sort()];
  };

  const filterTags = getAllTechnologies();

  // Filter projects based on active filter
  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => 
        project.technologies.includes(activeFilter)
      );

  // Group filtered projects into slides of 2
  const slides = [];
  for (let i = 0; i < filteredProjects.length; i += 2) {
    slides.push(filteredProjects.slice(i, i + 2));
  }

  const totalSlides = slides.length;
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalSlides - 1;

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);

  const goToNext = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Data Engineering': return Database;
      case 'Machine Learning': return Brain;
      case 'Business Intelligence': return TrendingUp;
      case 'Automation': return Code;
      default: return Database;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Data Engineering': return 'bg-blue-100 text-blue-700';
      case 'Machine Learning': return 'bg-purple-100 text-purple-700';
      case 'Business Intelligence': return 'bg-green-100 text-green-700';
      case 'Automation': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const ProjectCard = ({ project, index }) => {
    const IconComponent = getCategoryIcon(project.category);
    
    return (
      <div
        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fadeIn h-full flex flex-col"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Project Image */}
        <div className="relative overflow-hidden h-64 flex-shrink-0">
          <img 
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-white/90 ${getCategoryColor(project.category)}`}>
              <IconComponent className="w-4 h-4 mr-2" />
              {project.category}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.demoUrl && project.demoUrl !== '#' && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-5 h-5 text-gray-700" />
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-5 h-5 text-gray-700" />
            </a>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="font-bold text-gray-900 text-lg">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="mb-6 flex-grow">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    tech === activeFilter && activeFilter !== "All"
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-auto">
            <button 
              onClick={() => setSelectedProject(project)}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Play className="w-4 h-4 mr-2" />
              View Details
            </button>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className="py-24 bg-white overflow-x-hidden scroll-mt-24" ref={projectsRef}>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-thin text-gray-900 mb-6">Featured Projects</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Innovative solutions that transform data into actionable insights, delivering measurable business impact
          </p>
        </div>

        {/* Filter Tags */}
        <div className="mb-10 flex flex-wrap gap-2 justify-center">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`
                rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105
                ${activeFilter === tag 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-md'
                }
              `}
              aria-pressed={activeFilter === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            {activeFilter !== "All" && ` with ${activeFilter}`}
          </p>
        </div>

        {/* Carousel Container */}
        {filteredProjects.length > 0 ? (
          <div className="relative">
            {/* Carousel Track */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {slides.map((slideProjects, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {slideProjects.map((project, projectIndex) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          index={projectIndex}
                        />
                      ))}
                      {/* Empty placeholder for odd number of projects */}
                      {slideProjects.length === 1 && (
                        <div className="invisible">
                          <div className="bg-gray-50 rounded-3xl h-full min-h-[600px]" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                {canGoPrev && (
                  <button
                    onClick={goToPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 sm:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
                    aria-label="Previous projects"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                  </button>
                )}
                
                {canGoNext && (
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 sm:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
                    aria-label="Next projects"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                  </button>
                )}
              </>
            )}

            {/* Pagination Dots */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`transition-all duration-300 ${
                      currentPage === index 
                        ? 'w-8 h-2 bg-gray-900 rounded-full' 
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No projects found with {activeFilter} technology.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Show All Projects
            </button>
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-semibold text-gray-900">{selectedProject.title}</h3>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                  >
                    ×
                  </button>
                </div>
                
                <img 
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {selectedProject.description}
                </p>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                <ul className="space-y-2 mb-6">
                  {selectedProject.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Technologies Used</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.technologies.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  {selectedProject.demoUrl && selectedProject.demoUrl !== '#' && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors duration-300 text-center"
                    >
                      Live Demo
                    </a>
                  )}
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300 text-center"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
