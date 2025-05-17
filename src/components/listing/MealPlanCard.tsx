import React, { useState } from 'react';
import { MealPlan } from '../../types';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onSelectPlan: (planId: string) => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan, onSelectPlan }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const getPriceByBillingCycle = () => {
    switch(selectedBillingCycle) {
      case 'quarterly':
        return mealPlan.price_quarterly;
      case 'yearly':
        return mealPlan.price_yearly;
      default:
        return mealPlan.price_monthly;
    }
  };

  const getDiscount = () => {
    const monthlyPrice = mealPlan.price_monthly;
    const currentPrice = getPriceByBillingCycle();
    
    if (selectedBillingCycle === 'quarterly') {
      const quarterlyTotal = monthlyPrice * 3;
      return Math.round((1 - (currentPrice * 3) / quarterlyTotal) * 100);
    } else if (selectedBillingCycle === 'yearly') {
      const yearlyTotal = monthlyPrice * 12;
      return Math.round((1 - (currentPrice * 12) / yearlyTotal) * 100);
    }
    
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-lg">
      <div className="p-5 border-b border-neutral-200">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">{mealPlan.name}</h3>
        <p className="text-neutral-600 mb-4">{mealPlan.description}</p>
        
        {/* Billing Cycle Selection */}
        <div className="flex flex-wrap bg-neutral-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setSelectedBillingCycle('monthly')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              selectedBillingCycle === 'monthly' 
                ? 'bg-white shadow text-primary-600' 
                : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedBillingCycle('quarterly')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              selectedBillingCycle === 'quarterly' 
                ? 'bg-white shadow text-primary-600' 
                : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Quarterly
            {getDiscount() > 0 && selectedBillingCycle === 'quarterly' && (
              <span className="ml-1 text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                {getDiscount()}% off
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedBillingCycle('yearly')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              selectedBillingCycle === 'yearly' 
                ? 'bg-white shadow text-primary-600' 
                : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Yearly
            {getDiscount() > 0 && selectedBillingCycle === 'yearly' && (
              <span className="ml-1 text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                {getDiscount()}% off
              </span>
            )}
          </button>
        </div>
        
        {/* Price Display */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-primary-600">₹{getPriceByBillingCycle()}</span>
            <span className="text-neutral-500">/{selectedBillingCycle === 'monthly' ? 'mo' : selectedBillingCycle === 'quarterly' ? 'quarter' : 'year'}</span>
          </div>
          
          <div className="flex">
            <Button 
              onClick={() => onSelectPlan(mealPlan.id)} 
              className="mr-2"
            >
              Subscribe
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setExpanded(!expanded)}
              icon={expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              iconPosition="right"
            >
              {expanded ? 'Hide' : 'View'} Meals
            </Button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5">
              <h4 className="font-semibold text-lg mb-4">Weekly Meal Schedule</h4>
              
              <div className="space-y-6">
                {mealPlan.meals.map((mealDay, index) => (
                  <div key={index} className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                    <h5 className="font-medium text-neutral-800 mb-3 capitalize">{mealDay.day}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mealDay.breakfast && (
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <h6 className="text-sm font-medium text-neutral-700 mb-2">Breakfast</h6>
                          <p className="text-sm text-neutral-800">{mealDay.breakfast.name}</p>
                          <p className="text-xs text-neutral-600 mt-1">{mealDay.breakfast.description}</p>
                        </div>
                      )}
                      
                      {mealDay.lunch && (
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <h6 className="text-sm font-medium text-neutral-700 mb-2">Lunch</h6>
                          <p className="text-sm text-neutral-800">{mealDay.lunch.name}</p>
                          <p className="text-xs text-neutral-600 mt-1">{mealDay.lunch.description}</p>
                        </div>
                      )}
                      
                      {mealDay.dinner && (
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <h6 className="text-sm font-medium text-neutral-700 mb-2">Dinner</h6>
                          <p className="text-sm text-neutral-800">{mealDay.dinner.name}</p>
                          <p className="text-xs text-neutral-600 mt-1">{mealDay.dinner.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="font-semibold text-lg mb-3">Delivery Options</h4>
                <div className="flex items-center">
                  <div className="mr-6">
                    <div className="flex items-center mb-1">
                      <Check size={16} className="text-primary-600 mr-1" />
                      <span className="text-sm font-medium">Dine In Available</span>
                    </div>
                    <p className="text-xs text-neutral-600">Visit the restaurant during operating hours</p>
                  </div>
                  
                  {mealPlan.delivery_available && (
                    <div>
                      <div className="flex items-center mb-1">
                        <Check size={16} className="text-primary-600 mr-1" />
                        <span className="text-sm font-medium">Delivery Available</span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        ₹{mealPlan.delivery_fee} delivery fee per meal
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealPlanCard;