import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/listings';

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/listings`
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">Welcome Back</h1>
            <p className="text-neutral-600">Sign in to your MealMate account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              id="email"
              label="Email Address"
              icon={<Mail size={18} />}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              id="password"
              label="Password"
              icon={<Lock size={18} />}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-neutral-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/listings`
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
        address: formData.address
      });
      
      if (error) throw error;
      
      navigate('/listings');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">Create Your Account</h1>
            <p className="text-neutral-600">Join MealMate to find the perfect meal subscription</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                id="firstName"
                label="First Name"
                icon={<User size={18} />}
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              
              <Input
                type="text"
                id="lastName"
                label="Last Name"
                icon={<User size={18} />}
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <Input
              type="email"
              id="email"
              label="Email Address"
              icon={<Mail size={18} />}
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              type="tel"
              id="phone"
              label="Phone Number"
              icon={<Phone size={18} />}
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleChange}
            />
            
            <Input
              type="text"
              id="address"
              label="Address"
              icon={<MapPin size={18} />}
              placeholder="123 Main St, City, State"
              value={formData.address}
              onChange={handleChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                type="password"
                id="password"
                label="Password"
                icon={<Lock size={18} />}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              <Input
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                icon={<Lock size={18} />}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={formData.password !== formData.confirmPassword && formData.confirmPassword ? 'Passwords do not match' : ''}
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-start text-sm text-neutral-600">
                <input type="checkbox" className="mt-1 mr-2" required />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
                </span>
              </label>
            </div>
            
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleGoogleSignUp}
              >
                Sign up with Google
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};