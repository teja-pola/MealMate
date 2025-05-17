import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled || isOpen || location.pathname !== '/' 
      ? 'bg-white shadow-md py-3'
      : 'bg-transparent py-5'
  }`;

  const linkClasses = `transition-colors duration-200 hover:text-primary-600 ${
    scrolled || isOpen || location.pathname !== '/' 
      ? 'text-neutral-800'
      : 'text-white'
  }`;

  const buttonClasses = `px-4 py-2 rounded-lg transition-all duration-200 ${
    scrolled || isOpen || location.pathname !== '/' 
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-white text-primary-600 hover:bg-neutral-100'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ChefHat size={32} className={scrolled || isOpen || location.pathname !== '/' ? 'text-primary-600' : 'text-white'} />
          <span className={`text-2xl font-bold font-heading ${
            scrolled || isOpen || location.pathname !== '/' ? 'text-neutral-900' : 'text-white'
          }`}>
            MealMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${linkClasses} font-medium`}>Home</Link>
          <Link to="/about" className={`${linkClasses} font-medium`}>About Us</Link>
          <Link to="/listings" className={`${linkClasses} font-medium`}>Explore</Link>
          <Link to="/contact" className={`${linkClasses} font-medium`}>Contact</Link>
          <Link to="/list-property" className={`${linkClasses} font-medium`}>List Your Property</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/account" className={`${linkClasses} font-medium`}>My Account</Link>
              <button onClick={signOut} className={buttonClasses}>Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className={`${linkClasses} font-medium`}>Login</Link>
              <Link to="/signup" className={buttonClasses}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? (
            <X size={24} className="text-neutral-900" />
          ) : (
            <Menu size={24} className={scrolled || location.pathname !== '/' ? 'text-neutral-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height:  0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-5 flex flex-col space-y-4">
              <Link to="/" className="text-neutral-800 font-medium py-2">Home</Link>
              <Link to="/about" className="text-neutral-800 font-medium py-2">About Us</Link>
              <Link to="/listings" className="text-neutral-800 font-medium py-2">Explore</Link>
              <Link to="/contact" className="text-neutral-800 font-medium py-2">Contact</Link>
              <Link to="/list-property" className="text-neutral-800 font-medium py-2">List Your Property</Link>
              
              {user ? (
                <>
                  <Link to="/account" className="text-neutral-800 font-medium py-2">My Account</Link>
                  <button onClick={signOut} className="bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-neutral-800 font-medium py-2">Login</Link>
                  <Link to="/signup" className="bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;