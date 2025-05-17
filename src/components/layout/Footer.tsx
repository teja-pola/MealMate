import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <ChefHat size={32} className="text-primary-500" />
              <span className="text-2xl font-bold font-heading">MealMate</span>
            </div>
            <p className="text-neutral-300 mb-6">
              Connecting you with the best food subscription services in your area. Enjoy hassle-free meals tailored to your preferences.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-neutral-300 hover:text-primary-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-neutral-300 hover:text-primary-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-neutral-300 hover:text-primary-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" className="text-neutral-300 hover:text-primary-500 transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-neutral-300 hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-neutral-300 hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link to="/listings" className="text-neutral-300 hover:text-primary-500 transition-colors">Explore</Link></li>
              <li><Link to="/contact" className="text-neutral-300 hover:text-primary-500 transition-colors">Contact</Link></li>
              <li><Link to="/list-property" className="text-neutral-300 hover:text-primary-500 transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-neutral-300 hover:text-primary-500 transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-neutral-300 hover:text-primary-500 transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-neutral-300 hover:text-primary-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-neutral-300 hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/careers" className="text-neutral-300 hover:text-primary-500 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-neutral-300">Vadodara, Gujarat</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary-500 flex-shrink-0" />
                <span className="text-neutral-300">+91 8688524907</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-500 flex-shrink-0" />
                <span className="text-neutral-300">dteja2468@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MealMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;