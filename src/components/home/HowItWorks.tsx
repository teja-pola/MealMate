import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, List, CreditCard, Utensils } from 'lucide-react';

const steps = [
  {
    icon: <MapPin size={28} className="text-white" />,
    title: 'Enter Your Location',
    description: 'Input your address or use current location to find meal subscription options nearby.'
  },
  {
    icon: <List size={28} className="text-white" />,
    title: 'Browse Listings',
    description: 'View detailed listings with menus, pricing, and reviews to find the perfect meal plan.'
  },
  {
    icon: <CreditCard size={28} className="text-white" />,
    title: 'Subscribe & Pay',
    description: 'Choose your subscription duration and payment option with secure checkout.'
  },
  {
    icon: <Utensils size={28} className="text-white" />,
    title: 'Enjoy Your Meals',
    description: 'Start enjoying your meals via delivery or dine-in as per your subscription.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-neutral-900">
            How MealMate Works
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-600 text-lg">
            Follow these simple steps to find and subscribe to the perfect meal plan for your needs.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary-100 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="relative mb-5">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-5 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute top-0 -left-3 -right-3 -bottom-3 bg-primary-100 rounded-full -z-10 opacity-30"></div>
                  <div className="absolute -top-1 -left-1 w-5 h-5 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold border-2 border-primary-600">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;