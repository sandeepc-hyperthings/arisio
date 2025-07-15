import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase,
  CreditCard,
  Shield,
  Plus,
  Users
} from 'lucide-react';
import { UserInfo, TicketHolder, TicketType } from '../types';
import { EventCreationForm } from './EventCreationForm';

interface UserInfoFormProps {
  onSubmit: (ticketHolders: TicketHolder[]) => void;
  onBack: () => void;
  selectedTickets: {[key: string]: number};
  ticketTypes: TicketType[];
  totalTickets: number;
  totalPrice: number;
  isProcessing: boolean;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ 
  onSubmit, 
  onBack, 
  selectedTickets,
  ticketTypes,
  totalTickets, 
  totalPrice,
  isProcessing 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [ticketHolders, setTicketHolders] = useState<TicketHolder[]>(() => {
    const holders: TicketHolder[] = [];
    
    // Create holders for each ticket without pre-assigning types
    for (let i = 0; i < totalTickets; i++) {
      holders.push({
        ticketId: `ticket-${i + 1}`,
        ticketType: '', // Will be selected by user
        ticketName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: ''
      });
    }
    
    return holders;
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showEventForm, setShowEventForm] = useState(false);

  const applyCoupon = () => {
    setCouponError('');
    
    // Mock coupon validation - in real app, this would be an API call
    const validCoupons = {
      'SAVE10': { discount: 0.10, type: 'percentage' },
      'SAVE20': { discount: 0.20, type: 'percentage' },
      'EARLY50': { discount: 50, type: 'fixed' },
      'STUDENT': { discount: 0.15, type: 'percentage' }
    };

    const coupon = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];
    
    if (coupon) {
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = totalPrice * coupon.discount;
      } else {
        discount = Math.min(coupon.discount, totalPrice);
      }
      
      setCouponDiscount(discount);
      setIsCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code');
      setCouponDiscount(0);
      setIsCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponError('');
    setIsCouponApplied(false);
  };

  const finalPrice = totalPrice - couponDiscount;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    ticketHolders.forEach((holder, index) => {
      if (!holder.ticketType) {
        newErrors[`${index}-ticketType`] = 'Please select a ticket type';
      }

      if (!holder.firstName.trim()) {
        newErrors[`${index}-firstName`] = 'First name is required';
      }

      if (!holder.lastName.trim()) {
        newErrors[`${index}-lastName`] = 'Last name is required';
      }

      if (!holder.email.trim()) {
        newErrors[`${index}-email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(holder.email)) {
        newErrors[`${index}-email`] = 'Please enter a valid email address';
      }

      if (!holder.phone.trim()) {
        newErrors[`${index}-phone`] = 'Phone number is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(holder.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors[`${index}-phone`] = 'Please enter a valid phone number';
      }
    });

    // Validate ticket type distribution
    const assignedTickets: {[key: string]: number} = {};
    ticketHolders.forEach(holder => {
      if (holder.ticketType) {
        assignedTickets[holder.ticketType] = (assignedTickets[holder.ticketType] || 0) + 1;
      }
    });

    // Check if assigned tickets match selected quantities
    Object.entries(selectedTickets).forEach(([ticketTypeId, quantity]) => {
      const assigned = assignedTickets[ticketTypeId] || 0;
      if (assigned !== quantity) {
        newErrors['ticketDistribution'] = `Please assign exactly ${quantity} ${ticketTypes.find(t => t.id === ticketTypeId)?.name} ticket(s)`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(ticketHolders);
    }
  };

  const handleInputChange = (index: number, field: keyof UserInfo, value: string) => {
    setTicketHolders(prev => prev.map((holder, i) => 
      i === index ? { ...holder, [field]: value } : holder
    ));
    
    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleTicketTypeChange = (index: number, ticketTypeId: string) => {
    const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
    setTicketHolders(prev => prev.map((holder, i) => 
      i === index ? { 
        ...holder, 
        ticketType: ticketTypeId,
        ticketName: ticketType?.name || ''
      } : holder
    ));
    
    // Clear related errors
    if (errors[`${index}-ticketType`]) {
      setErrors(prev => ({ ...prev, [`${index}-ticketType`]: '' }));
    }
    if (errors['ticketDistribution']) {
      setErrors(prev => ({ ...prev, ticketDistribution: '' }));
    }
  };

  const getAvailableTicketTypes = (currentIndex: number) => {
    const assignedCounts: {[key: string]: number} = {};
    
    // Count currently assigned tickets (excluding current holder)
    ticketHolders.forEach((holder, index) => {
      if (index !== currentIndex && holder.ticketType) {
        assignedCounts[holder.ticketType] = (assignedCounts[holder.ticketType] || 0) + 1;
      }
    });
    
    // Return ticket types that still have available slots
    return ticketTypes.filter(ticketType => {
      const maxQuantity = selectedTickets[ticketType.id] || 0;
      const currentlyAssigned = assignedCounts[ticketType.id] || 0;
      return currentlyAssigned < maxQuantity;
    });
  };
  const copyToAll = (sourceIndex: number, field: keyof UserInfo) => {
    const sourceValue = ticketHolders[sourceIndex][field];
    setTicketHolders(prev => prev.map(holder => ({ ...holder, [field]: sourceValue })));
  };

  const handleSaveEvent = (eventData: any) => {
    console.log('New event created:', eventData);
    setShowEventForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/image.png" 
                alt="Arisio" 
                className="h-10 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              {['News', 'Mandates', 'Events', 'Community', 'Resources', 'Pricing'].map((item) => (
                <a key={item} href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowEventForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
                Sign Up / Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Event Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendee Information</h1>
                <p className="text-gray-600">
                  Please provide details for all {totalTickets} ticket holder{totalTickets > 1 ? 's' : ''}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
              <form id="user-info-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Ticket Distribution Error */}
                {errors['ticketDistribution'] && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{errors['ticketDistribution']}</p>
                  </div>
                )}

                {ticketHolders.map((holder, index) => {
                  const currentTicketType = ticketTypes.find(t => t.id === holder.ticketType);
                  const availableTypes = getAvailableTicketTypes(index);
                  
                  return (
                    <div key={holder.ticketId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentTicketType?.color || 'from-gray-400 to-gray-500'}`}></div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {holder.ticketName || 'Unassigned'} - Attendee #{index + 1}
                          </h3>
                        </div>
                        {index === 0 && totalTickets > 1 && (
                          <div className="flex items-center space-x-2 text-sm text-blue-600">
                            <Users className="h-4 w-4" />
                            <span>Primary ticket holder</span>
                          </div>
                        )}
                      </div>

                      {/* Ticket Type Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ticket Type *
                        </label>
                        <select
                          value={holder.ticketType}
                          onChange={(e) => handleTicketTypeChange(index, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors[`${index}-ticketType`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select ticket type</option>
                          {availableTypes.map(ticketType => (
                            <option key={ticketType.id} value={ticketType.id}>
                              {ticketType.name} - ${ticketType.price}
                            </option>
                          ))}
                          {/* Show current selection even if no longer available */}
                          {holder.ticketType && !availableTypes.find(t => t.id === holder.ticketType) && (
                            <option value={holder.ticketType}>
                              {currentTicketType?.name} - ${currentTicketType?.price} (Selected)
                            </option>
                          )}
                        </select>
                        {errors[`${index}-ticketType`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`${index}-ticketType`]}</p>
                        )}
                      </div>

                      {/* Personal Information */}
                      <div className="mb-4">                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                First Name *
                              </label>
                            </div>
                            <input
                              type="text"
                              value={holder.firstName}
                              onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors[`${index}-firstName`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter first name"
                            />
                            {errors[`${index}-firstName`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`${index}-firstName`]}</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Last Name *
                              </label>
                            </div>
                            <input
                              type="text"
                              value={holder.lastName}
                              onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors[`${index}-lastName`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter last name"
                            />
                            {errors[`${index}-lastName`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`${index}-lastName`]}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-4">                        
                        <div className="md:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Email Address *
                              </label>
                            </div>
                            <input
                              type="email"
                              value={holder.email}
                              onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors[`${index}-email`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter email address"
                            />
                            {errors[`${index}-email`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`${index}-email`]}</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Phone Number *
                              </label>
                            </div>
                            <input
                              type="tel"
                              value={holder.phone}
                              onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors[`${index}-phone`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter phone number"
                            />
                            {errors[`${index}-phone`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`${index}-phone`]}</p>
                            )}
                          </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {/* Security Notice */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Information</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        All personal information is encrypted and secure. We'll only use it for event registration and communication.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {Object.entries(selectedTickets).map(([ticketTypeId, quantity]) => {
                  if (quantity > 0) {
                    const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
                    if (ticketType) {
                      return (
                        <div key={ticketTypeId} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {ticketType.name} × {quantity}
                          </span>
                          <span className="font-medium">
                            ${(quantity * ticketType.price).toLocaleString()}
                          </span>
                        </div>
                      );
                    }
                  }
                  return null;
                })}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tickets</span>
                    <span className="font-medium">{totalTickets}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-blue-600">${finalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Coupon Discount */}
                {couponDiscount > 0 && (
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>-${couponDiscount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Coupon Code</h3>
                {!isCouponApplied ? (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          couponCode.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        {couponCode.toUpperCase()} applied
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-sm text-green-700 hover:text-green-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Try: SAVE10, SAVE20, EARLY50, or STUDENT
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onBack}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Event Details
                </button>
                
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform ${
                    isProcessing
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600 hover:scale-105 shadow-lg'
                  }`}
                >
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>
                    {isProcessing ? 'Processing...' : `Complete Purchase - $${finalPrice.toLocaleString()}`}
                  </span>
                </div>
              </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment processing with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Form Modal */}
      {showEventForm && (
        <EventCreationForm 
          onClose={() => setShowEventForm(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};