import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import Button from '../ui/Button';

// This would typically come from an API call
const mockListings = [
  {
    id: '1',
    name: 'Golden Spoon Restaurant',
    image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: 'Downtown, New York',
    rating: 4.8,
    reviewCount: 120,
    priceFrom: 149 * 82
  },
  {
    id: '2',
    name: 'Healthy Harvest Meals',
    image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: 'Chelsea, New York',
    rating: 4.6,
    reviewCount: 95,
    priceFrom: 129 * 82
  },
  {
    id: '3',
    name: 'Flavor Fusion Kitchen',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: 'Brooklyn, New York',
    rating: 4.9,
    reviewCount: 87,
    priceFrom: 159 * 82
  },
  {
    id: '4',
    name: 'Urban Bites Cafe',
    image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    location: 'Tribeca, New York',
    rating: 4.7,
    reviewCount: 64,
    priceFrom: 139 * 82
  }
];

const PopularListings: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-neutral-900">
              Popular Meal Plans
            </h2>
            <p className="max-w-2xl text-neutral-600 text-lg">
              Discover top-rated food subscription services loved by our community.
            </p>
          </div>
          <Link to="/listings" className="mt-4 md:mt-0">
            <Button variant="outline">View All Listings</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-2">
                  <div className="flex items-center text-yellow-500 mr-2">
                    <Star size={16} fill="currentColor" />
                    <span className="ml-1 text-sm font-medium">{listing.rating}</span>
                  </div>
                  <span className="text-neutral-500 text-sm">({listing.reviewCount} reviews)</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">{listing.name}</h3>
                <div className="flex items-center text-neutral-500 mb-4">
                  <MapPin size={16} />
                  <span className="ml-1 text-sm">{listing.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-neutral-500">Starting from</span>
                    <p className="text-primary-600 font-bold">₹{listing.priceFrom}/mo</p>
                  </div>
                  <Link to={`/listing/${listing.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularListings;