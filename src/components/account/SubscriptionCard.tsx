import React from 'react';
import { Subscription } from '../../types';
import Button from '../ui/Button';
import { CalendarClock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionCardProps {
  subscription: Subscription;
  listingName: string;
  listingImage: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  subscription, 
  listingName,
  listingImage 
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-1">
          <img
            src={listingImage}
            alt={listingName}
            className="w-full h-full object-cover md:h-44 md:w-auto"
          />
        </div>
        
        <div className="p-5 md:col-span-3">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">{listingName}</h3>
              <p className="text-neutral-600 text-sm">Meal Plan ID: {subscription.meal_plan_id}</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <CalendarClock size={16} className="text-neutral-500 mr-1" />
                <span className="text-sm text-neutral-600">
                  {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="text-neutral-500 mr-1" />
                <span className="text-sm text-neutral-600">
                  {subscription.is_delivery 
                    ? `Delivery to ${subscription.delivery_address}` 
                    : 'Dine-in'
                  }
                </span>
              </div>
              <p className="text-sm text-neutral-600 mt-1">
                Billing cycle: <span className="font-medium">{subscription.billing_cycle}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-end mt-4">
            <Link to={`/listing/${subscription.listing_id}`}>
              <Button variant="outline" size="sm" icon={<ChevronRight size={16} />} iconPosition="right">
                View Listing
              </Button>
            </Link>
            
            {subscription.status === 'active' && (
              <Button variant="primary" size="sm">
                Manage Subscription
              </Button>
            )}
            
            {subscription.status === 'expired' && (
              <Button variant="primary" size="sm">
                Renew Subscription
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;