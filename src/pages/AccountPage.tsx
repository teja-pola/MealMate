import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, FileText, Settings, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import SubscriptionCard from '../components/account/SubscriptionCard';
import { Subscription } from '../types';

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('subscriptions')
        //   .select('*')
        //   .eq('user_id', user?.id);
        
        // if (error) throw error;
        
        // Mock data for demo
        const mockSubscriptions: Subscription[] = [
          {
            id: 'sub1',
            user_id: user?.id || '',
            listing_id: '1',
            meal_plan_id: 'mp1',
            start_date: '2023-04-01',
            end_date: '2023-07-01',
            billing_cycle: 'monthly',
            is_delivery: true,
            delivery_address: '123 Main St, Apt 4B, New York, NY 10001',
            delivery_time: '18:00',
            status: 'active',
            created_at: '2023-04-01T00:00:00Z'
          },
          {
            id: 'sub2',
            user_id: user?.id || '',
            listing_id: '3',
            meal_plan_id: 'mp2',
            start_date: '2023-02-15',
            end_date: '2023-05-15',
            billing_cycle: 'quarterly',
            is_delivery: false,
            status: 'cancelled',
            created_at: '2023-02-15T00:00:00Z'
          }
        ];
        
        setSubscriptions(mockSubscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">My Account</h1>
          <p className="text-neutral-600">Manage your subscriptions, payments, and account settings</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden sticky top-28">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{user.first_name} {user.last_name}</h3>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`w-full flex items-center p-3 rounded-lg mb-1 text-left ${
                    activeTab === 'subscriptions' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <FileText size={18} className="mr-3" />
                  <span>My Subscriptions</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center p-3 rounded-lg mb-1 text-left ${
                    activeTab === 'payments' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard size={18} className="mr-3" />
                  <span>Payment Methods</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center p-3 rounded-lg mb-1 text-left ${
                    activeTab === 'profile' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center p-3 rounded-lg mb-1 text-left ${
                    activeTab === 'settings' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center p-3 rounded-lg text-neutral-700 hover:bg-neutral-50 text-left"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'subscriptions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">My Subscriptions</h2>
                  <Button size="sm" variant="outline" onClick={() => navigate('/listings')}>
                    Browse More Plans
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-neutral-600">Loading your subscriptions...</p>
                  </div>
                ) : (
                  <>
                    {subscriptions.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
                        <h3 className="text-xl font-bold text-neutral-800 mb-2">No subscriptions yet</h3>
                        <p className="text-neutral-600 mb-6">You haven't subscribed to any meal plans yet.</p>
                        <Button onClick={() => navigate('/listings')}>
                          Browse Meal Plans
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {subscriptions.map(subscription => (
                          <SubscriptionCard
                            key={subscription.id}
                            subscription={subscription}
                            listingName={
                              subscription.listing_id === '1' 
                                ? 'Golden Spoon Restaurant' 
                                : subscription.listing_id === '3'
                                ? 'Flavor Fusion Kitchen'
                                : 'Unknown Restaurant'
                            }
                            listingImage={
                              subscription.listing_id === '1'
                                ? 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                                : subscription.listing_id === '3'
                                ? 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                                : 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                            }
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Profile Information</h2>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={user.first_name}
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={user.last_name}
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={user.email}
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={user.phone_number || 'Not provided'}
                        readOnly
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={user.address || 'Not provided'}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>Edit Profile</Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Payment Methods</h2>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 text-center">
                  <h3 className="text-xl font-bold text-neutral-800 mb-2">No payment methods</h3>
                  <p className="text-neutral-600 mb-6">You haven't added any payment methods yet.</p>
                  <Button>Add Payment Method</Button>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Account Settings</h2>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Notifications</h3>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3" defaultChecked />
                      <div>
                        <span className="font-medium text-neutral-800 block mb-1">Email Notifications</span>
                        <span className="text-sm text-neutral-600">Receive updates about your subscriptions, special offers, and account activity.</span>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3" defaultChecked />
                      <div>
                        <span className="font-medium text-neutral-800 block mb-1">SMS Notifications</span>
                        <span className="text-sm text-neutral-600">Receive text messages for delivery updates and important alerts.</span>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3" />
                      <div>
                        <span className="font-medium text-neutral-800 block mb-1">Marketing Communications</span>
                        <span className="text-sm text-neutral-600">Receive promotional emails, newsletters, and special offers.</span>
                      </div>
                    </label>
                  </div>
                  
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 pt-4 border-t border-neutral-200">Account Security</h3>
                  <div className="space-y-4">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline" className="ml-3">Enable Two-Factor Authentication</Button>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-neutral-200">
                    <Button variant="outline" className="text-error-600 border-error-600 hover:bg-error-50">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;