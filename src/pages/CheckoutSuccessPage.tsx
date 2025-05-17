import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const CheckoutSuccessPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is not logged in, redirect to home
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle size={48} className="text-green-600" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-neutral-900 mb-4 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Payment Successful!
          </motion.h1>
          
          <motion.p 
            className="text-neutral-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Your subscription has been activated successfully. You can now enjoy your meal plan!
          </motion.p>
          
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="border border-neutral-200 rounded-lg p-4 text-left mb-4">
              <h3 className="font-bold text-neutral-900 mb-2">Order Details</h3>
              <p className="text-sm text-neutral-600 mb-1">Order Number: #MMS-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p className="text-sm text-neutral-600 mb-1">Order Date: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-neutral-600">Payment Method: •••• 4242</p>
            </div>
            
            <p className="text-sm text-neutral-600 mb-4">
              A confirmation email has been sent to your registered email address with all the details.
            </p>
            
            <div className="space-y-3">
              <Link to="/account">
                <Button fullWidth>
                  View My Subscriptions
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" fullWidth>
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;