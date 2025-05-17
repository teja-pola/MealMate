import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Developer',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'MealMate has completely changed how I eat during the work week. The subscription plan from Golden Spoon Restaurant is both affordable and delicious. No more skipping lunch or settling for fast food!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'College Student',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'As a student, finding quality meals near campus was always a challenge. With MealMate, I found an affordable meal plan that keeps me well-fed with nutritious food. Highly recommend!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Travel Blogger',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'When I\'m in a new city for an extended period, MealMate is my go-to for finding great local food. The flexibility of choosing between delivery and dining in is perfect for my lifestyle.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Patel',
    role: 'Business Consultant',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'The variety of cuisine options on MealMate is impressive. I\'ve been able to try foods from different cultures without breaking the bank. The yearly subscription provides excellent value.',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 font-heading text-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-neutral-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Join thousands of satisfied users who have found their perfect meal subscription through MealMate.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.1 }}
          className="px-5"
        >
          <Slider {...settings} className="testimonial-slider -mx-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 h-full">
                  <div className="flex items-center mb-4 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                        className={i < testimonial.rating ? 'text-yellow-500' : 'text-neutral-300'} 
                      />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4" 
                    />
                    <div>
                      <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;