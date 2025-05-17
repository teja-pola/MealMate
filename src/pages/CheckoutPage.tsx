import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Clock, MapPin, ChevronLeft, CalendarClock, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { Listing, MealPlan } from '../types';
import { supabase } from '../lib/supabase';

const CheckoutPage: React.FC = () => {
  const { listingId, planId } = useParams<{ listingId: string; planId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [deliveryOption, setDeliveryOption] = useState<'dine-in' | 'delivery'>('dine-in');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/checkout/${listingId}/${planId}`);
      return;
    }
    
    const fetchCheckoutData = async () => {
      setLoading(true);
      
      try {
        // In a real app, these would be Supabase queries
        // const { data: listingData, error: listingError } = await supabase
        //   .from('listings')
        //   .select('*')
        //   .eq('id', listingId)
        //   .single();
        
        // if (listingError) throw listingError;
        
        // const { data: mealPlanData, error: mealPlanError } = await supabase
        //   .from('meal_plans')
        //   .select('*')
        //   .eq('id', planId)
        //   .eq('listing_id', listingId)
        //   .single();
        
        // if (mealPlanError) throw mealPlanError;
        
        // Mock data for demonstration
        const mockListing: Listing = {
          id: listingId || '1',
          name: 'Golden Spoon Restaurant',
          description: 'Experience fine dining with our diverse menu offerings.',
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
          created_at: '2023-01-15T00:00:00Z'
        };
        
        // Use planId to determine which mock plan to return
        const mockMealPlan: MealPlan = planId === 'mp2' ? {
          id: 'mp2',
          listing_id: listingId || '1',
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
            }
          ],
          delivery_available: true,
          delivery_fee: 0,
          created_at: '2023-01-16T00:00:00Z'
        } : {
          id: 'mp1',
          listing_id: listingId || '1',
          name: 'Basic Plan',
          description: 'Perfect for those looking for a simple meal plan with essential nutrition.',
          price_monthly: 149,
          price_quarterly: 139,
          price_yearly: 129,
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
            }
          ],
          delivery_available: true,
          delivery_fee: 2.99,
          created_at: '2023-01-16T00:00:00Z'
        };
        
        setListing(mockListing);
        setMealPlan(mockMealPlan);
        setDeliveryAddress(user.address || '');
      } catch (error) {
        console.error('Error fetching checkout data:', error);
        setError('Failed to load checkout information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckoutData();
  }, [listingId, planId, user, navigate]);

  const getPriceByBillingCycle = () => {
    if (!mealPlan) return 0;
    
    switch(billingCycle) {
      case 'quarterly':
        return mealPlan.price_quarterly;
      case 'yearly':
        return mealPlan.price_yearly;
      default:
        return mealPlan.price_monthly;
    }
  };

  const getSubtotal = () => {
    if (!mealPlan) return 0;
    
    const basePrice = getPriceByBillingCycle();
    const multiplier = billingCycle === 'monthly' ? 1 : billingCycle === 'quarterly' ? 3 : 12;
    
    return basePrice * multiplier;
  };

  const getDeliveryTotal = () => {
    if (!mealPlan || deliveryOption === 'dine-in') return 0;
    
    // Simplified calculation - in reality would be based on frequency and delivery days
    const estimatedDeliveries = billingCycle === 'monthly' ? 20 : billingCycle === 'quarterly' ? 60 : 240;
    
    return mealPlan.delivery_fee * estimatedDeliveries;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryTotal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deliveryOption === 'delivery' && !deliveryAddress) {
      setError('Delivery address is required');
      return;
    }
    
    setPaymentProcessing(true);
    
    try {
      // In a real app, this would integrate with Stripe API and then create a subscription record
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to success page
      navigate('/checkout/success');
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (!listing || !mealPlan) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Checkout Information Not Found</h2>
          <p className="text-neutral-600 mb-8">We couldn't find the meal plan you're looking for.</p>
          <Link to="/listings">
            <Button>Browse All Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link to={`/listing/${listing.id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ChevronLeft size={16} className="mr-1" />
            Back to listing
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-900 mt-4 mb-2 font-heading">Checkout</h1>
          <p className="text-neutral-600">{listing.name} - {mealPlan.name}</p>
        </div>
        
        {error && (
          <div className="bg-error-50 text-error-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Subscription Options */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Subscription Options</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Billing Cycle</label>
                  <div className="flex flex-wrap bg-neutral-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                        billingCycle === 'monthly' 
                          ? 'bg-white shadow text-primary-600' 
                          : 'text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Monthly (${mealPlan.price_monthly}/mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('quarterly')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                        billingCycle === 'quarterly' 
                          ? 'bg-white shadow text-primary-600' 
                          : 'text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Quarterly (${mealPlan.price_quarterly}/mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('yearly')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                        billingCycle === 'yearly' 
                          ? 'bg-white shadow text-primary-600' 
                          : 'text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Yearly (${mealPlan.price_yearly}/mo)
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Dining Options</label>
                  <div className="space-y-4">
                    <label className="flex items-start p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="dine-in"
                        checked={deliveryOption === 'dine-in'}
                        onChange={() => setDeliveryOption('dine-in')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-neutral-900">Dine In</h3>
                        <p className="text-sm text-neutral-600">Visit {listing.name} to enjoy your meals at the restaurant.</p>
                        <div className="flex items-center mt-2 text-sm text-neutral-500">
                          <MapPin size={16} className="mr-1" />
                          <span>{listing.location.address}, {listing.location.city}</span>
                        </div>
                      </div>
                    </label>
                    
                    {mealPlan.delivery_available && (
                      <label className="flex items-start p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="delivery"
                          checked={deliveryOption === 'delivery'}
                          onChange={() => setDeliveryOption('delivery')}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-neutral-900">Delivery</h3>
                          <p className="text-sm text-neutral-600">
                            Have your meals delivered to your location.
                            {mealPlan.delivery_fee > 0 
                              ? ` Delivery fee: $${mealPlan.delivery_fee.toFixed(2)} per meal.` 
                              : ' Free delivery!'
                            }
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
                
                {deliveryOption === 'delivery' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-neutral-200 overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Delivery Address</label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your full delivery address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required={deliveryOption === 'delivery'}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Delivery Time</label>
                        <select
                          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          required={deliveryOption === 'delivery'}
                        >
                          <option value="">Select a time</option>
                          <option value="morning">Morning (8:00 AM - 10:00 AM)</option>
                          <option value="lunch">Lunch (11:30 AM - 1:30 PM)</option>
                          <option value="evening">Evening (5:30 PM - 7:30 PM)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Step 2: Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Payment Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      type="text" 
                      id="cardName" 
                      label="Name on Card" 
                      icon={<User size={18} />}
                      placeholder="John Doe"
                      required
                    />
                    
                    <Input 
                      type="text" 
                      id="cardNumber" 
                      label="Card Number" 
                      icon={<CreditCard size={18} />}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <Input 
                        type="text" 
                        id="expiry" 
                        label="Expiry Date" 
                        icon={<CalendarClock size={18} />}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <Input 
                        type="text" 
                        id="cvc" 
                        label="Security Code (CVC)" 
                        placeholder="123"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1">
                      <Input 
                        type="text" 
                        id="zip" 
                        label="Zip/Postal Code" 
                        icon={<MapPin size={18} />}
                        placeholder="12345"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3" required />
                      <span className="text-sm text-neutral-600">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? 'Processing...' : `Complete Payment ($${getTotal().toFixed(2)})`}
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 sticky top-28">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>
                
                <div className="flex items-start mb-4">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.name} 
                    className="w-16 h-16 object-cover rounded-md mr-3" 
                  />
                  <div>
                    <h3 className="font-bold text-neutral-900">{listing.name}</h3>
                    <p className="text-sm text-neutral-600">{mealPlan.name}</p>
                  </div>
                </div>
                
                <div className="text-sm space-y-1 mb-4">
                  <div className="flex items-center text-neutral-700">
                    <Clock size={16} className="mr-2 text-neutral-500" />
                    <span>
                      {billingCycle === 'monthly' ? 'Monthly' : billingCycle === 'quarterly' ? 'Quarterly' : 'Yearly'} subscription
                    </span>
                  </div>
                  
                  <div className="flex items-center text-neutral-700">
                    <Check size={16} className="mr-2 text-green-600" />
                    <span>
                      {mealPlan.meals.length} days of meals per week
                    </span>
                  </div>
                  
                  <div className="flex items-center text-neutral-700">
                    <MapPin size={16} className="mr-2 text-neutral-500" />
                    <span>
                      {deliveryOption === 'dine-in' ? 'Dine-in at restaurant' : 'Delivery'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subscription</span>
                    <span className="text-neutral-900">
                      ${getPriceByBillingCycle()}/mo
                      {billingCycle !== 'monthly' && ` x ${billingCycle === 'quarterly' ? '3' : '12'} months`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="text-neutral-900">${getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {deliveryOption === 'delivery' && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Delivery Fee</span>
                      <span className="text-neutral-900">${getDeliveryTotal().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-neutral-200">
                    <div className="flex justify-between font-bold">
                      <span className="text-neutral-800">Total</span>
                      <span className="text-primary-600">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-50 p-3 rounded-lg text-sm text-primary-700">
                  <p>
                    {billingCycle === 'monthly' 
                      ? 'You will be billed monthly until you cancel.' 
                      : billingCycle === 'quarterly' 
                        ? 'You will be billed quarterly. Next billing date will be in 3 months.'
                        : 'You will be billed yearly. Next billing date will be in 12 months.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;