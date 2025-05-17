import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-neutral-900 mb-4 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-heading">Get in Touch</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                label="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Input
                type="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <Input
                type="text"
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button type="submit" icon={<Send size={18} />}>
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-heading">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-medium text-neutral-900">Email</h3>
                    <a href="mailto:dtea2468@gmail.com" className="text-neutral-600 hover:text-primary-600">
                      dtea2468@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-medium text-neutral-900">Phone</h3>
                    <a href="tel:+918688524907" className="text-neutral-600 hover:text-primary-600">
                      +91 8688524907
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-medium text-neutral-900">Location</h3>
                    <p className="text-neutral-600">
                      Vadodara, Gujarat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-heading">Connect With Us</h2>
              
              <div className="space-y-4">
                <a
                  href="https://github.com/teja-pola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  <Github className="w-6 h-6 mr-4" />
                  <span>GitHub</span>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/dharmatejapola/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  <Linkedin className="w-6 h-6 mr-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;