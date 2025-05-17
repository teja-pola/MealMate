import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchFilters from '../components/listings/SearchFilters';
import ListingCard from '../components/listings/ListingCard';
import { Listing } from '../types';
import { supabase } from '../lib/supabase';

const ListingsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialLocation = searchParams.get('location') || '';
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: initialLocation,
    priceRange: [0, 500],
    mealTypes: [] as string[],
    amenities: [] as string[],
    deliveryOption: null as string | null
  });

  // This would be replaced with an actual API call in a production app
  useEffect(() => {
    // Simulating API call with timeout
    const fetchListings = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be a fetch from Supabase or other API
        // const { data, error } = await supabase
        //   .from('listings')
        //   .select('*')
        //   .ilike('location.city', `%${filters.location}%`);
        
        // if (error) throw error;
        
        // Mock data for demonstration
        const mockListings: Listing[] = [
          {
            id: '1',
            name: 'Golden Spoon Restaurant',
            description: 'Offers a variety of traditional and modern cuisine with an emphasis on fresh, local ingredients.',
            location: {
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              zip: '10001',
              coordinates: [-73.9857, 40.7484]
            },
            amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Outdoor Seating'],
            rating: 4.8,
            reviews_count: 120,
            images: ['https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            owner_id: 'owner1',
            created_at: '2023-01-15T00:00:00Z',
            price: 100 * 82
          },
          {
            id: '2',
            name: 'Healthy Harvest Meals',
            description: 'Specializing in nutritious, balanced meals made with organic ingredients.',
            location: {
              address: '456 Park Ave',
              city: 'New York',
              state: 'NY',
              zip: '10022',
              coordinates: [-73.9654, 40.7629]
            },
            amenities: ['Vegetarian Options', 'Vegan Options', 'Gluten-Free Options'],
            rating: 4.6,
            reviews_count: 95,
            images: ['https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            owner_id: 'owner2',
            created_at: '2023-02-10T00:00:00Z',
            price: 80 * 82
          },
          {
            id: '3',
            name: 'Flavor Fusion Kitchen',
            description: 'An eclectic mix of international cuisines, offering a global dining experience.',
            location: {
              address: '789 Broadway',
              city: 'New York',
              state: 'NY',
              zip: '10003',
              coordinates: [-73.9911, 40.7351]
            },
            amenities: ['Private Rooms', 'Full Bar', 'Catering', 'WiFi'],
            rating: 4.9,
            reviews_count: 87,
            images: ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            owner_id: 'owner3',
            created_at: '2023-03-05T00:00:00Z',
            price: 90 * 82
          },
          {
            id: '4',
            name: 'Urban Bites Cafe',
            description: 'Cozy cafe offering a variety of breakfast and lunch options in a relaxed atmosphere.',
            location: {
              address: '101 5th Ave',
              city: 'New York',
              state: 'NY',
              zip: '10003',
              coordinates: [-73.9927, 40.7377]
            },
            amenities: ['WiFi', 'Coffee', 'Breakfast', 'Lunch'],
            rating: 4.7,
            reviews_count: 64,
            images: ['https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            owner_id: 'owner4',
            created_at: '2023-04-20T00:00:00Z',
            price: 86 * 82
          },
          {
            id: '5',
            name: 'Sunrise Breakfast Club',
            description: 'Specializing in breakfast and brunch options, with a focus on fresh ingredients.',
            location: {
              address: '222 W 23rd St',
              city: 'New York',
              state: 'NY',
              zip: '10011',
              coordinates: [-73.9973, 40.7445]
            },
            amenities: ['Breakfast', 'Brunch', 'Outdoor Seating', 'Family Friendly'],
            rating: 4.5,
            reviews_count: 110,
            images: ['https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            owner_id: 'owner5',
            created_at: '2023-05-15T00:00:00Z',
            price: 79 * 82
          },
          {
            id: '6',
            name: 'Mediterranean Delight',
            description: 'Authentic Mediterranean cuisine using traditional recipes and ingredients.',
            location: {
              address: '333 E 60th St',
              city: 'New York',
              state: 'NY',
              zip: '10022',
              coordinates: [-73.9612, 40.7618]
            },
            amenities: ['Halal', 'Vegetarian Options', 'Outdoor Seating', 'Delivery'],
            rating: 4.4,
            reviews_count: 78,
            images: ['https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            owner_id: 'owner6',
            created_at: '2023-06-10T00:00:00Z',
            price: 92 * 82
          }
        ];
        
        // Filter mockListings based on location
        let filteredListings = mockListings;
        
        if (filters.location) {
          filteredListings = filteredListings.filter(listing => 
            listing.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
            listing.location.address.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        
        setListings(filteredListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [filters.location]);

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">Find Meal Subscriptions</h1>
          <p className="text-neutral-600">
            {filters.location 
              ? `Showing results for "${filters.location}"`
              : 'Browse all available meal subscription options'
            }
          </p>
        </div>
        
        <SearchFilters onSearch={handleSearch} initialLocation={initialLocation} />
        
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading listings...</p>
          </div>
        ) : (
          <>
                {listings.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-neutral-800 mb-2">No listings found</h3>
                    <p className="text-neutral-600 mb-6">Try adjusting your search filters or location</p>
                    <button 
                      onClick={() => setFilters({ ...filters, location: '' })}
                      className="text-primary-600 font-medium hover:text-primary-700"
                    >
                      Clear search and show all listings
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(listing => (
                      <ListingCard key={listing.id} listing={listing} price={listing.price ?? 0} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    };
    
    export default ListingsPage;
