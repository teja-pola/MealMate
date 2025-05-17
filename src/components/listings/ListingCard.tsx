import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Listing } from '../../types';
import Button from '../ui/Button';

interface ListingCardProps {
  listing: Listing;
  price: number;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, price }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-semibold flex items-center shadow-sm">
          <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
          <span>{listing.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-neutral-900">{listing.name}</h3>
        
        <div className="flex items-center text-neutral-600 mb-3">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{listing.location.address}, {listing.location.city}</span>
        </div>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index} 
                className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-neutral-500">Starting from</p>
            <p className="text-primary-600 font-bold">₹{price}/mo</p>
          </div>
          
          <Link to={`/listing/${listing.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
