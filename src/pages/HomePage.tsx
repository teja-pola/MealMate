import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import PopularListings from '../components/home/PopularListings';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <PopularListings />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;