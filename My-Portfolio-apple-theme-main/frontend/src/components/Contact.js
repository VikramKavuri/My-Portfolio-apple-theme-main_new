import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, Calendar, Clock } from 'lucide-react';
import { mockContactInfo } from '../mock/data';
import { useToast } from '../hooks/use-toast';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await emailjs.send(
        'service_6ahvylx',                    // ← FIXED: removed escaped underscore
        'template_gqls6i4',                   // ← FIXED: removed escaped underscore
        {                                     
          from_name: formData.name,           // ← FIXED: removed escaped underscore
          from_email: formData.email,         // ← FIXED: removed escaped underscore
          company: formData.company,
          subject: formData.subject,
          message: formData.message,
          to_email: 'thrivikr@buffalo.edu'   // ← FIXED: removed escaped underscore
        },
        'tAgUh8kfCp_a0b60h'                   // ← FIXED: removed escaped underscore
      );

      console.log('✅ EmailJS SUCCESS:', response);
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. I'll get back to you within 24 hours.",
      });

      setFormData({ 
        name: '', 
        email: '', 
        company: '', 
        subject: '', 
        message: '' 
      });

    } catch (error) {
      console.error('❌ EmailJS ERROR:', error);
      
      toast({
        title: "Message Failed", 
        description: "There was an error sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-thin text-gray-900 mb-6">Let's Connect</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Ready to transform your data challenges into strategic advantages? 
            Let's discuss how I can help drive your next data initiative
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-8">Get In Touch</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                I'm always interested in discussing new opportunities, 
                challenging projects, and innovative data solutions. 
                Whether you're looking for a data engineer, consultant, 
                or technical advisor, I'd love to hear from you.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Email</div>
                  <a 
                    href={`mailto:${mockContactInfo.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  >
                    {mockContactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Phone</div>
                  <a 
                    href={`tel:${mockContactInfo.phone}`}
                    className="text-green-600 hover:text-green-800 transition-colors duration-300"
                  >
                    {mockContactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Location</div>
                  <div className="text-gray-600">{mockContactInfo.location}</div>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors duration-300">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Timezone</div>
                  <div className="text-gray-600">{mockContactInfo.timezone}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect on Social</h4>
              <div className="flex space-x-4">
                <a 
                  href={mockContactInfo.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
                <a 
                  href={mockContactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <Github className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Availability Status</div>
                  <div className="text-gray-600">{mockContactInfo.availability}</div>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a subject</option>
                  <option value="job-opportunity">Job Opportunity</option>
                  <option value="consulting">Consulting Project</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell me about your project, requirements, or how I can help..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {/* Response Time */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-medium">
                  Typical response time: Within 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
