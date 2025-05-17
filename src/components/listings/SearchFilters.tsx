import React, { useState } from 'react';
import { Search, Sliders, MapPin, DollarSign } from 'lucide-react';
import Button from '../ui/Button';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  initialLocation?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, initialLocation = '' }) => {
  const [location, setLocation] = useState(initialLocation);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [deliveryOption, setDeliveryOption] = useState<string | null>(null);

  const toggleMealType = (type: string) => {
    setMealTypes(prev => 
      prev.includes(type) 
        ? prev.filter(item => item !== type) 
        : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(item => item !== amenity) 
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      priceRange,
      mealTypes,
      amenities,
      deliveryOption
    });
  };

  const resetFilters = () => {
    setPriceRange([0, 500]);
    setMealTypes([]);
    setAmenities([]);
    setDeliveryOption(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 border border-neutral-200">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Enter location..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            icon={<Sliders size={18} />}
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto w-full"
          >
            Filters
          </Button>
          
          <Button 
            type="submit" 
            icon={<Search size={18} />}
            className="md:w-auto w-full"
          >
            Search
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-neutral-800">Price Range (Monthly)</h3>
                <div className="px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">${priceRange[0]}</span>
                    <span className="text-sm text-neutral-600">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-neutral-800">Meal Types</h3>
                <div className="space-y-2">
                  {['Breakfast', 'Lunch', 'Dinner', 'Vegetarian', 'Vegan', 'Gluten-Free'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={mealTypes.includes(type)}
                        onChange={() => toggleMealType(type)}
                        className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-neutral-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-neutral-800">Amenities</h3>
                <div className="space-y-2">
                  {['WiFi', 'Air Conditioning', 'Parking', 'Outdoor Seating', 'Private Rooms'].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-neutral-700">{amenity}</span>
                    </label>
                  ))}
                </div>
                
                <h3 className="font-medium mb-3 mt-4 text-neutral-800">Delivery Options</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'delivery'}
                      onChange={() => setDeliveryOption('delivery')}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Delivery Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'dine-in'}
                      onChange={() => setDeliveryOption('dine-in')}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Dine-in Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === null}
                      onChange={() => setDeliveryOption(null)}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Both</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="text"
                onClick={resetFilters}
                className="mr-2"
              >
                Reset Filters
              </Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;