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
  const [ticketHolders, setTicketHolders] = useState<TicketHolder[]>(() => {
    const holders: TicketHolder[] = [];
    let ticketIndex = 0;
    
    Object.entries(selectedTickets).forEach(([ticketTypeId, quantity]) => {
      if (quantity > 0) {
        const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
        if (ticketType) {
          for (let i = 0; i < quantity; i++) {
            holders.push({
              ticketId: `${ticketTypeId}-${i + 1}`,
              ticketType: ticketTypeId,
              ticketName: ticketType.name,
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              company: '',
              jobTitle: ''
            });
            ticketIndex++;
          }
        }
      }
    });
    
    return holders;
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showEventForm, setShowEventForm] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    ticketHolders.forEach((holder, index) => {
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
                {ticketHolders.map((holder, index) => {
                  const ticketType = ticketTypes.find(t => t.id === holder.ticketType);
                  return (
                    <div key={holder.ticketId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${ticketType?.color || 'from-blue-500 to-blue-600'}`}></div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {holder.ticketName} - Ticket #{index + 1}
                          </h3>
                        </div>
                        {index === 0 && totalTickets > 1 && (
                          <div className="flex items-center space-x-2 text-sm text-blue-600">
                            <Users className="h-4 w-4" />
                            <span>Primary ticket holder</span>
                          </div>
                        )}
                      </div>

                      {/* Personal Information */}
                      <div className="mb-4">
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-600" />
                          Personal Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                First Name *
                              </label>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => copyToAll(0, 'firstName')}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  Copy from first
                                </button>
                              )}
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
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => copyToAll(0, 'lastName')}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  Copy from first
                                </button>
                              )}
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
                      <div className="mb-2">
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-blue-600" />
                          Contact Information
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Email Address *
                              </label>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => copyToAll(0, 'email')}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  Copy from first
                                </button>
                              )}
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
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => copyToAll(0, 'phone')}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  Copy from first
                                </button>
                              )}
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

                      {/* Professional Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                          Professional Information (Optional)
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Company
                              </label>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => copyToAll(0, 'company')}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  Copy from first
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={holder.company}
                              onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="Enter company name"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Job Title
                              </label>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => copyToAll(0, 'jobTitle')}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  Copy from first
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={holder.jobTitle}
                              onChange={(e) => handleInputChange(index, 'jobTitle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="Enter job title"
                            />
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
                    <span className="text-blue-600">${totalPrice.toLocaleString()}</span>
                  </div>
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
                  form="user-info-form"
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
                    {isProcessing ? 'Processing...' : `Complete Purchase - $${totalPrice.toLocaleString()}`}
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