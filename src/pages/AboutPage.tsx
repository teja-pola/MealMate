import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-heading">About MealMate</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Revolutionizing the way people discover and subscribe to meal plans in their area.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-heading">Our Story</h2>
            <p className="text-neutral-700 mb-4">
              MealMate was founded by Dharma Teja Pola with a vision to solve a common problem faced by students, 
              working professionals, and travelers - finding reliable and convenient meal options near their location.
            </p>
            <p className="text-neutral-700">
              Our platform connects users with local restaurants and food services, offering flexible subscription 
              plans that cater to various dietary preferences and schedules.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-heading">Founder</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-80 h-48 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D03AQHVK22gv6gB_Q/profile-displayphoto-shrink_400_400/B4DZUS713iHkAg-/0/1739779433168?e=2147483647&v=beta&t=zkwTaLXr95xow8Pg25IIeEns36RDXVKF3waKfEn0Qvs"
                  alt="Dharma Teja Pola"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Dharma Teja Pola</h3>
                <p className="text-neutral-600 mb-4">Founder & CEO</p>
                <p className="text-neutral-700 mb-6">
                  A passionate entrepreneur with a vision to revolutionize the food service industry 
                  through technology and innovation. With a background in software development and 
                  a deep understanding of customer needs, Teja leads MealMate's mission to make 
                  quality food accessible to everyone.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/teja-pola"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dharmatejapola/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="mailto:dteja2468@gmail.com"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                  <a
                    href="tel:+918688524907"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <Phone size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-heading">Our Mission</h2>
            <p className="text-neutral-700 mb-4">
              At MealMate, we're committed to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Making quality food accessible to everyone</li>
              <li>Supporting local restaurants and food businesses</li>
              <li>Providing flexible and affordable meal subscription options</li>
              <li>Creating a seamless experience for both customers and food providers</li>
              <li>Building a community around great food and convenience</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;