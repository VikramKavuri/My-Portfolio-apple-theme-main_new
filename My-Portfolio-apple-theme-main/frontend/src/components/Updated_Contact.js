
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { toast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, email, subject, message } = formData;
    if (!fullName || !email || !subject || !message) {
      toast({ title: 'Validation Error', description: 'All fields are required.' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    emailjs.send(
      'service_xxx', // Replace with your EmailJS service ID
      'template_xxx', // Replace with your EmailJS template ID
      {
        from_name: formData.fullName,
        from_email: formData.email,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        to_email: 'vikram@gmail.com'
      },
      'user_xxx' // Replace with your EmailJS user/public key
    )
    .then(() => {
      toast({ title: 'Message Sent', description: 'Your message has been sent successfully.' });
      setFormData({ fullName: '', email: '', company: '', subject: '', message: '' });
    })
    .catch((error) => {
      toast({ title: 'Error', description: 'Failed to send message. Please try again later.' });
      console.error('EmailJS error:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Get In Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company/Organization</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
