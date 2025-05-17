import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Phone, Mail, MapPin, Tag, FileCheck, CheckCircle, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ListPropertyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    description: '',
    amenities: [] as string[],
    images: [] as string[],
    breakfast: false,
    lunch: false,
    dinner: false
  });
  
  const [submitted, setSubmitted] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would submit data to Supabase
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <Input
                type="text"
                id="businessName"
                label="Business Name"
                icon={<Building size={18} />}
                placeholder="Golden Spoon Restaurant"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Business Type</label>
                <select
                  id="businessType"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.businessType}
                  onChange={(e) => updateFormData('businessType', e.target.value)}
                  required
                >
                  <option value="">Select Business Type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="hotel">Hotel Restaurant</option>
                  <option value="cloud_kitchen">Cloud Kitchen</option>
                  <option value="catering">Catering Service</option>
                </select>
              </div>
              
              <Input
                type="text"
                id="address"
                label="Street Address"
                icon={<MapPin size={18} />}
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  id="city"
                  label="City"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  required
                />
                
                <Input
                  type="text"
                  id="state"
                  label="State/Province"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  required
                />
                
                <Input
                  type="text"
                  id="zip"
                  label="Zip/Postal Code"
                  placeholder="10001"
                  value={formData.zip}
                  onChange={(e) => updateFormData('zip', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <Input
                type="text"
                id="ownerName"
                label="Owner/Manager Name"
                placeholder="John Doe"
                value={formData.ownerName}
                onChange={(e) => updateFormData('ownerName', e.target.value)}
                required
              />
              
              <Input
                type="tel"
                id="phoneNumber"
                label="Phone Number"
                icon={<Phone size={18} />}
                placeholder="(123) 456-7890"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                required
              />
              
              <Input
                type="email"
                id="email"
                label="Email Address"
                icon={<Mail size={18} />}
                placeholder="business@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Business Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your business, cuisine specialty, and what makes your food unique..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Property Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Amenities (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['WiFi', 'Air Conditioning', 'Parking', 'Outdoor Seating', 'Private Rooms', 
                    'Vegetarian Options', 'Vegan Options', 'Wheelchair Accessible', 'Full Bar', 
                    'Catering Service', 'Delivery Available', 'Takeout Available'].map((amenity) => (
                    <label key={amenity} className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="mr-3"
                      />
                      <span className="text-neutral-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Meals Offered
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.breakfast}
                      onChange={() => updateFormData('breakfast', !formData.breakfast)}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-neutral-800 block">Breakfast</span>
                      <span className="text-sm text-neutral-500">Morning meal options</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lunch}
                      onChange={() => updateFormData('lunch', !formData.lunch)}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-neutral-800 block">Lunch</span>
                      <span className="text-sm text-neutral-500">Midday meal options</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dinner}
                      onChange={() => updateFormData('dinner', !formData.dinner)}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-neutral-800 block">Dinner</span>
                      <span className="text-sm text-neutral-500">Evening meal options</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Property Images
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <Upload size={40} className="mx-auto text-neutral-400 mb-4" />
                  <p className="text-neutral-600 mb-2">Drag and drop images here, or click to browse</p>
                  <p className="text-sm text-neutral-500 mb-4">Upload high-quality images of your property, food, and dining area</p>
                  <Button type="button" variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Review & Submit</h2>
            
            <div className="space-y-6">
              <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200">
                <h3 className="font-bold text-neutral-800 flex items-center">
                  <Building size={18} className="mr-2 text-primary-600" />
                  Business Information
                </h3>
                <div className="mt-3 pl-6 space-y-1">
                  <p><span className="font-medium">Name:</span> {formData.businessName || 'Not provided'}</p>
                  <p><span className="font-medium">Type:</span> {formData.businessType || 'Not provided'}</p>
                  <p><span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                </div>
              </div>
              
              <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200">
                <h3 className="font-bold text-neutral-800 flex items-center">
                  <Mail size={18} className="mr-2 text-primary-600" />
                  Contact Information
                </h3>
                <div className="mt-3 pl-6 space-y-1">
                  <p><span className="font-medium">Owner/Manager:</span> {formData.ownerName || 'Not provided'}</p>
                  <p><span className="font-medium">Phone:</span> {formData.phoneNumber || 'Not provided'}</p>
                  <p><span className="font-medium">Email:</span> {formData.email || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200">
                <h3 className="font-bold text-neutral-800 flex items-center">
                  <Tag size={18} className="mr-2 text-primary-600" />
                  Property Details
                </h3>
                <div className="mt-3 pl-6">
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-neutral-600 mb-4">{formData.description || 'Not provided'}</p>
                  
                  <p className="font-medium mb-2">Amenities:</p>
                  {formData.amenities.length === 0 ? (
                    <p className="text-neutral-600 mb-4">No amenities selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.amenities.map(amenity => (
                        <span key={amenity} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="font-medium mb-2">Meals Offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.breakfast && (
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Breakfast
                      </span>
                    )}
                    {formData.lunch && (
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Lunch
                      </span>
                    )}
                    {formData.dinner && (
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Dinner
                      </span>
                    )}
                    {!formData.breakfast && !formData.lunch && !formData.dinner && (
                      <span className="text-neutral-600">No meals selected</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" required />
                  <span className="text-sm text-neutral-600">
                    I certify that I am the owner or authorized representative of this business and that the information provided is accurate and complete. I agree to MealMate's{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>.
                  </span>
                </label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (submitted) {
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
              <FileCheck size={48} className="text-green-600" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold text-neutral-900 mb-4 font-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Submission Successful!
            </motion.h1>
            
            <motion.p 
              className="text-neutral-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Thank you for listing your property with MealMate. Our team will review your submission within 1-2 business days and contact you for the next steps.
            </motion.p>
            
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link to="/">
                <Button fullWidth>
                  Return to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">List Your Property</h1>
          <p className="text-neutral-600">Join MealMate as a partner and reach thousands of potential customers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-center mb-8 overflow-hidden">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex-1 relative">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium relative z-10 ${
                    currentStep === step 
                      ? 'bg-primary-600 text-white' 
                      : currentStep > step 
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle size={16} />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div 
                    className={`absolute top-4 left-8 w-full h-0.5 ${
                      currentStep > step ? 'bg-primary-600' : 'bg-neutral-200'
                    }`}
                  />
                )}
                <div className={`text-xs mt-2 font-medium ${
                  currentStep >= step ? 'text-primary-600' : 'text-neutral-500'
                }`}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Contact'}
                  {step === 3 && 'Details'}
                  {step === 4 && 'Review'}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                >
                  Back
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < 4 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyPage;