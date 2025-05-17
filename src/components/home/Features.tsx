import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Map, Calendar, Clock, Utensils } from 'lucide-react';

const features = [
  {
    icon: <Search className="w-6 h-6 text-primary-600" />,
    title: 'Easy Search',
    description: 'Find meal subscriptions near your location with just a few clicks.'
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary-600" />,
    title: 'Flexible Subscriptions',
    description: 'Choose monthly, quarterly, or yearly plans with easy cancellation.'
  },
  {
    icon: <Utensils className="w-6 h-6 text-primary-600" />,
    title: 'Customizable Meals',
    description: 'Select which meals you want included in your subscription plan.'
  },
  {
    icon: <Map className="w-6 h-6 text-primary-600" />,
    title: 'Delivery Options',
    description: 'Get your meals delivered or dine in at the restaurant.'
  },
  {
    icon: <Clock className="w-6 h-6 text-primary-600" />,
    title: 'Scheduled Deliveries',
    description: 'Schedule your meal deliveries at a time that suits you.'
  },
  {
    icon: <CreditCard className="w-6 h-6 text-primary-600" />,
    title: 'Easy Payments',
    description: 'Secure and hassle-free payment options for your subscriptions.'
  }
];

const Features: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-neutral-900">
            Why Choose MealMate?
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-600 text-lg">
            Our platform makes it easy to find and subscribe to delicious meal plans that fit your lifestyle and preferences.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;