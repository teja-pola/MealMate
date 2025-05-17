import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Utensils, Wifi, Clock, Coffee } from 'lucide-react';
import { Listing, MealPlan } from '../types';
import MealPlanCard from '../components/listing/MealPlanCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      
      try {
        // In a real app, these would be actual Supabase queries
        // const { data: listingData, error: listingError } = await supabase
        //   .from('listings')
        //   .select('*')
        //   .eq('id', id)
        //   .single();
        
        // if (listingError) throw listingError;
        
        // const { data: mealPlansData, error: mealPlansError } = await supabase
        //   .from('meal_plans')
        //   .select('*')
        //   .eq('listing_id', id);
        
        // if (mealPlansError) throw mealPlansError;
        
        // Mock data for demonstration
        const mockListing: Listing = {
          id: id || '1',
          name: 'Golden Spoon Restaurant',
          description: 'Experience fine dining with our diverse menu offerings. Located in the heart of downtown, Golden Spoon Restaurant provides a cozy atmosphere with professional service. Our chefs create delicious meals using fresh, locally-sourced ingredients.',
          location: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            coordinates: [-73.9857, 40.7484]
          },
          amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Outdoor Seating', 'Private Dining', 'Vegetarian Options', 'Full Bar', 'Wheelchair Accessible'],
          rating: 4.8,
          reviews_count: 120,
          images: [
            'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          owner_id: 'owner1',
          created_at: '2023-01-15T00:00:00Z'
        };
        
        const mockMealPlans: MealPlan[] = [
          {
            id: 'mp1',
            listing_id: id || '1',
            name: 'Basic Plan',
            description: 'Perfect for those looking for a simple meal plan with essential nutrition.',
            price_monthly: 100,
            price_quarterly: 99,
            price_yearly: 95,
            meals: [
              {
                day: 'monday',
                breakfast: {
                  id: 'b1',
                  name: 'Continental Breakfast',
                  description: 'Fresh pastries, fruit, yogurt, and coffee.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'l1',
                  name: 'Caesar Salad with Grilled Chicken',
                  description: 'Romaine lettuce, croutons, parmesan, and our special dressing.',
                  dietary_info: []
                },
                dinner: {
                  id: 'd1',
                  name: 'Spaghetti Bolognese',
                  description: 'Classic pasta with rich meat sauce and garlic bread.',
                  dietary_info: []
                }
              },
              {
                day: 'tuesday',
                breakfast: {
                  id: 'b2',
                  name: 'American Breakfast',
                  description: 'Eggs, bacon, toast, and hashbrowns.',
                  dietary_info: []
                },
                lunch: {
                  id: 'l2',
                  name: 'Club Sandwich',
                  description: 'Triple-decker with turkey, bacon, lettuce, and tomato.',
                  dietary_info: []
                },
                dinner: {
                  id: 'd2',
                  name: 'Grilled Salmon',
                  description: 'With steamed vegetables and herb rice.',
                  dietary_info: ['gluten-free']
                }
              },
              {
                day: 'wednesday',
                breakfast: {
                  id: 'b3',
                  name: 'Fruit & Granola Bowl',
                  description: 'Mixed fruits with yogurt and homemade granola.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'l3',
                  name: 'Chicken Wrap',
                  description: 'Grilled chicken with fresh veggies and sauce in a tortilla.',
                  dietary_info: []
                },
                dinner: {
                  id: 'd3',
                  name: 'Beef Stir Fry',
                  description: 'With mixed vegetables and steamed rice.',
                  dietary_info: []
                }
              },
              {
                day: 'thursday',
                breakfast: {
                  id: 'b4',
                  name: 'Pancakes',
                  description: 'Stack of fluffy pancakes with maple syrup and butter.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'l4',
                  name: 'Vegetable Soup & Sandwich',
                  description: 'Hearty vegetable soup with grilled cheese sandwich.',
                  dietary_info: ['vegetarian']
                },
                dinner: {
                  id: 'd4',
                  name: 'Roast Chicken',
                  description: 'With mashed potatoes and seasonal vegetables.',
                  dietary_info: ['gluten-free']
                }
              },
              {
                day: 'friday',
                breakfast: {
                  id: 'b5',
                  name: 'Avocado Toast',
                  description: 'Multigrain toast with smashed avocado and poached eggs.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'l5',
                  name: 'Cobb Salad',
                  description: 'With chicken, bacon, blue cheese, eggs, and avocado.',
                  dietary_info: ['gluten-free']
                },
                dinner: {
                  id: 'd5',
                  name: 'Fish & Chips',
                  description: 'Battered fish with thick-cut fries and tartar sauce.',
                  dietary_info: []
                }
              },
              {
                day: 'saturday',
                breakfast: {
                  id: 'b6',
                  name: 'Breakfast Burrito',
                  description: 'Eggs, cheese, potatoes, and salsa in a flour tortilla.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'l6',
                  name: 'Burger & Fries',
                  description: 'Beef patty with cheese, lettuce, tomato, and special sauce.',
                  dietary_info: []
                },
                dinner: {
                  id: 'd6',
                  name: 'Pasta Primavera',
                  description: 'Pasta with seasonal vegetables in a light cream sauce.',
                  dietary_info: ['vegetarian']
                }
              },
              {
                day: 'sunday',
                breakfast: {
                  id: 'b7',
                  name: 'Brunch Platter',
                  description: 'Eggs benedict, fruit, pastries, and mimosa.',
                  dietary_info: []
                },
                lunch: {
                  id: 'l7',
                  name: 'Chef\'s Special Salad',
                  description: 'Weekly rotating special featuring seasonal ingredients.',
                  dietary_info: []
                },
                dinner: {
                  id: 'd7',
                  name: 'Sunday Roast',
                  description: 'Roast beef with Yorkshire pudding and all the trimmings.',
                  dietary_info: []
                }
              }
            ],
            delivery_available: true,
            delivery_fee: 2.99,
            created_at: '2023-01-16T00:00:00Z'
          },
          {
            id: 'mp2',
            listing_id: id || '1',
            name: 'Premium Plan',
            description: 'Our most popular plan featuring chef\'s specials and premium ingredients.',
            price_monthly: 199,
            price_quarterly: 179,
            price_yearly: 159,
            meals: [
              {
                day: 'monday',
                breakfast: {
                  id: 'pb1',
                  name: 'Gourmet Breakfast',
                  description: 'Belgian waffles, fresh berries, whipped cream, and premium coffee.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'pl1',
                  name: 'Grilled Shrimp Salad',
                  description: 'Mixed greens with grilled shrimp, avocado, and citrus dressing.',
                  dietary_info: ['gluten-free']
                },
                dinner: {
                  id: 'pd1',
                  name: 'Filet Mignon',
                  description: 'With truffle mashed potatoes and asparagus.',
                  dietary_info: ['gluten-free']
                }
              },
              {
                day: 'tuesday',
                breakfast: {
                  id: 'pb2',
                  name: 'Eggs Benedict',
                  description: 'English muffin with poached eggs, Canadian bacon, and hollandaise.',
                  dietary_info: []
                },
                lunch: {
                  id: 'pl2',
                  name: 'Lobster Roll',
                  description: 'Maine lobster with light mayo on a toasted brioche bun.',
                  dietary_info: []
                },
                dinner: {
                  id: 'pd2',
                  name: 'Duck Confit',
                  description: 'With cherry sauce and wild rice pilaf.',
                  dietary_info: ['gluten-free']
                }
              },
              {
                day: 'wednesday',
                breakfast: {
                  id: 'pb3',
                  name: 'Smoked Salmon Plate',
                  description: 'With cream cheese, capers, red onion, and bagel.',
                  dietary_info: []
                },
                lunch: {
                  id: 'pl3',
                  name: 'Gourmet Burger',
                  description: 'Wagyu beef with truffle aioli and artisanal cheese.',
                  dietary_info: []
                },
                dinner: {
                  id: 'pd3',
                  name: 'Seafood Paella',
                  description: 'Traditional Spanish rice dish with various seafood.',
                  dietary_info: []
                }
              },
              {
                day: 'thursday',
                breakfast: {
                  id: 'pb4',
                  name: 'French Toast',
                  description: 'Brioche bread with fresh berries and maple syrup.',
                  dietary_info: ['vegetarian']
                },
                lunch: {
                  id: 'pl4',
                  name: 'Truffle Risotto',
                  description: 'Creamy Arborio rice with wild mushrooms and truffle oil.',
                  dietary_info: ['vegetarian', 'gluten-free']
                },
                dinner: {
                  id: 'pd4',
                  name: 'Rack of Lamb',
                  description: 'With mint jelly, roasted potatoes, and seasonal vegetables.',
                  dietary_info: ['gluten-free']
                }
              },
              {
                day: 'friday',
                breakfast: {
                  id: 'pb5',
                  name: 'Acai Bowl',
                  description: 'Acai puree topped with granola, fresh fruit, and honey.',
                  dietary_info: ['vegetarian', 'vegan']
                },
                lunch: {
                  id: 'pl5',
                  name: 'Tuna Nicoise',
                  description: 'Seared ahi tuna with haricots verts, potatoes, eggs, and olives.',
                  dietary_info: ['gluten-free']
                },
                dinner: {
                  id: 'pd5',
                  name: 'Lobster Thermidor',
                  description: 'Classic French dish with lobster in a rich sauce.',
                  dietary_info: []
                }
              },
              {
                day: 'saturday',
                breakfast: {
                  id: 'pb6',
                  name: 'Crab Cake Benedict',
                  description: 'Poached eggs on crab cakes with hollandaise sauce.',
                  dietary_info: []
                },
                lunch: {
                  id: 'pl6',
                  name: 'Mediterranean Plate',
                  description: 'Hummus, baba ganoush, falafel, and pita bread.',
                  dietary_info: ['vegetarian', 'vegan']
                },
                dinner: {
                  id: 'pd6',
                  name: 'Beef Wellington',
                  description: 'Filet wrapped in puff pastry with mushroom duxelles.',
                  dietary_info: []
                }
              },
              {
                day: 'sunday',
                breakfast: {
                  id: 'pb7',
                  name: 'Champagne Brunch',
                  description: 'Assortment of premium breakfast items with champagne.',
                  dietary_info: []
                },
                lunch: {
                  id: 'pl7',
                  name: 'Steak Sandwich',
                  description: 'Sliced ribeye with caramelized onions on artisanal bread.',
                  dietary_info: []
                },
                dinner: {
                  id: 'pd7',
                  name: 'Chef\'s Tasting Menu',
                  description: 'Five-course meal featuring seasonal specialties.',
                  dietary_info: []
                }
              }
            ],
            delivery_available: true,
            delivery_fee: 0,
            created_at: '2023-01-16T00:00:00Z'
          }
        ];
        
        setListing(mockListing);
        setMealPlans(mockMealPlans);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListingDetails();
  }, [id]);

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      // Redirect to login page with return URL
      window.location.href = `/login?redirect=/checkout/${id}/${planId}`;
      return;
    }
    
    // Navigate to checkout page
    window.location.href = `/checkout/${id}/${planId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Listing not found</h2>
          <p className="text-neutral-600 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/listings">
            <Button>Browse All Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-neutral-500 hover:text-primary-600">Home</Link>
            <span className="mx-2 text-neutral-400">/</span>
            <Link to="/listings" className="text-neutral-500 hover:text-primary-600">Listings</Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-neutral-900 font-medium">{listing.name}</span>
          </div>
        </div>
        
        {/* Listing Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">{listing.name}</h1>
              <div className="flex items-center">
                <div className="flex items-center text-yellow-500 mr-3">
                  <Star size={18} fill="currentColor" />
                  <span className="ml-1 font-medium">{listing.rating}</span>
                </div>
                <span className="text-neutral-500">({listing.reviews_count} reviews)</span>
                <span className="mx-2 text-neutral-300">•</span>
                <div className="flex items-center text-neutral-500">
                  <MapPin size={16} className="mr-1" />
                  <span>{listing.location.address}, {listing.location.city}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">Share</Button>
              <Button variant="outline">Save</Button>
            </div>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="h-96 overflow-hidden rounded-lg">
            <img 
              src={listing.images[activeImageIndex]} 
              alt={listing.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {listing.images.slice(0, 4).map((image, index) => (
              <div 
                key={index} 
                className={`h-44 overflow-hidden rounded-lg cursor-pointer 
                  ${index === activeImageIndex ? 'ring-2 ring-primary-600' : ''}
                `}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${listing.name} ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Listing Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-neutral-900">About {listing.name}</h2>
              <p className="text-neutral-700 mb-6">{listing.description}</p>
              
              <h3 className="text-lg font-bold mb-3 text-neutral-900">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-neutral-700">
                    {amenity === 'WiFi' && <Wifi size={18} className="mr-2 text-primary-600" />}
                    {amenity === 'Parking' && <Clock size={18} className="mr-2 text-primary-600" />}
                    {amenity === 'Vegetarian Options' && <Utensils size={18} className="mr-2 text-primary-600" />}
                    {amenity === 'Full Bar' && <Coffee size={18} className="mr-2 text-primary-600" />}
                    {!['WiFi', 'Parking', 'Vegetarian Options', 'Full Bar'].includes(amenity) && 
                      <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                        <span className="text-primary-600 text-xs">✓</span>
                      </div>
                    }
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-bold mb-3 text-neutral-900">Location</h3>
              <p className="text-neutral-700 mb-2">
                {listing.location.address}, {listing.location.city}, {listing.location.state} {listing.location.zip}
              </p>
              <div className="bg-neutral-100 h-48 rounded-lg flex items-center justify-center mb-4">
                <p className="text-neutral-500">Map view would be displayed here</p>
                {/* In a real app, this would be a MapBox or Google Maps component */}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Reviews
                  <span className="ml-2 text-yellow-500 flex items-center text-lg">
                    <Star size={20} fill="currentColor" />
                    <span className="ml-1">{listing.rating}</span>
                    <span className="ml-2 text-neutral-500 font-normal">({listing.reviews_count} reviews)</span>
                  </span>
                </h2>
                <Button variant="outline" size="sm">Write a Review</Button>
              </div>
              
              <div className="space-y-6">
                {/* This would be populated with actual reviews in a real app */}
                <div className="pb-6 border-b border-neutral-200">
                  <div className="flex items-start mb-3">
                    <img 
                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600" 
                      alt="Michael Chen" 
                      className="w-10 h-10 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <h4 className="font-bold text-neutral-900">Michael Chen</h4>
                      <p className="text-neutral-500 text-sm">Visited April 2023</p>
                    </div>
                    <div className="ml-auto flex items-center text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1">5.0</span>
                    </div>
                  </div>
                  <p className="text-neutral-700">
                    The food was absolutely amazing! I've been subscribing to their lunch plan for 3 months now and have never been disappointed. The delivery is always on time and the food is still hot.
                  </p>
                </div>
                
                <div className="pb-6 border-b border-neutral-200">
                  <div className="flex items-start mb-3">
                    <img 
                      src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600" 
                      alt="Emma Wilson" 
                      className="w-10 h-10 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <h4 className="font-bold text-neutral-900">Emma Wilson</h4>
                      <p className="text-neutral-500 text-sm">Visited March 2023</p>
                    </div>
                    <div className="ml-auto flex items-center text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1">4.5</span>
                    </div>
                  </div>
                  <p className="text-neutral-700">
                    Great variety in their meal plans! I love that I can choose between delivery and dining in. The staff is very friendly and accommodating to dietary restrictions.
                  </p>
                </div>
                
                <Link to="#" className="text-primary-600 font-medium hover:text-primary-700 block text-center">
                  View all {listing.reviews_count} reviews
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h2 className="text-2xl font-bold mb-4 text-neutral-900">Available Meal Plans</h2>
              <div className="space-y-6">
                {mealPlans.map(plan => {
                  const convertedPlan = {
                    ...plan,
                    price_monthly: plan.price_monthly * 82,
                    price_quarterly: plan.price_quarterly * 82,
                    price_yearly: plan.price_yearly * 82,
                    delivery_fee: plan.delivery_fee * 82,
                  };
                  return (
                    <MealPlanCard 
                      key={convertedPlan.id} 
                      mealPlan={convertedPlan} 
                      onSelectPlan={handleSelectPlan} 
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;