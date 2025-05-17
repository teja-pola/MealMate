import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Utensils, Store } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-primary-600 relative overflow-hidden">
      {/* Abstract Shape */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#FFFFFF" d="M47.1,-57.3C61.1,-45.2,72.8,-30.1,77.7,-12.7C82.6,4.7,80.8,24.3,71.3,39C61.9,53.7,44.8,63.3,26.5,69.8C8.2,76.3,-11.4,79.6,-31.8,75.2C-52.2,70.8,-73.5,58.5,-83.7,39.7C-93.9,20.9,-93.1,-4.4,-84.6,-25.6C-76.1,-46.7,-60,-63.6,-42.1,-74.4C-24.2,-85.3,-4.4,-90.1,12.7,-85.6C29.8,-81.1,59.7,-67.3,47.1,-57.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-heading">
              Ready to Join MealMate?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-lg">
              Whether you're looking for a meal subscription or want to list your restaurant, MealMate makes it easy to get started.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary"
                  icon={<Utensils size={20} />}
                >
                  Find a Meal Plan
                </Button>
              </Link>
              <Link to="/list-property">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  icon={<Store size={20} />}
                >
                  List Your Restaurant
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="hidden md:block"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-neutral-900">Start in Minutes</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-3">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Create an account</h4>
                    <p className="text-neutral-600 text-sm">Sign up with your email in less than a minute.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-3">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Find your perfect plan</h4>
                    <p className="text-neutral-600 text-sm">Enter your location and browse available options.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-3">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Subscribe & enjoy</h4>
                    <p className="text-neutral-600 text-sm">Set up your subscription and start enjoying your meals.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;