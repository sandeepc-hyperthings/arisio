import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Globe, 
  Plus, 
  Minus, 
  Save,
  X,
  Clock,
  DollarSign,
  Users,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface EventCreationFormProps {
  onClose: () => void;
  onSave: (eventData: any) => void;
}

interface TicketTypeForm {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  maxAttendees: number;
}

export const EventCreationForm: React.FC<EventCreationFormProps> = ({ onClose, onSave }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    venueType: 'physical', // physical, virtual, hybrid
    country: '',
    city: '',
    address: '',
    virtualLink: '',
    category: '',
    tags: '',
    imageUrl: '',
    eventType: 'free' // free or paid
  });

  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([
    {
      id: 'general',
      name: 'General Admission',
      price: 0,
      description: '',
      benefits: [''],
      maxAttendees: 100
    }
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEventTypeChange = (type: 'free' | 'paid') => {
    setEventData(prev => ({ ...prev, eventType: type }));
    
    // Reset ticket prices based on event type
    if (type === 'free') {
      setTicketTypes(prev => prev.map(ticket => ({ ...ticket, price: 0 })));
    }
  };

  const addTicketType = () => {
    const newTicketType: TicketTypeForm = {
      id: `ticket-${Date.now()}`,
      name: '',
      price: eventData.eventType === 'free' ? 0 : 0,
      description: '',
      benefits: [''],
      maxAttendees: 100
    };
    setTicketTypes(prev => [...prev, newTicketType]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateTicketType = (index: number, field: string, value: any) => {
    setTicketTypes(prev => prev.map((ticket, i) => 
      i === index ? { ...ticket, [field]: value } : ticket
    ));
  };

  const addBenefit = (ticketIndex: number) => {
    setTicketTypes(prev => prev.map((ticket, i) => 
      i === ticketIndex ? { ...ticket, benefits: [...ticket.benefits, ''] } : ticket
    ));
  };

  const removeBenefit = (ticketIndex: number, benefitIndex: number) => {
    setTicketTypes(prev => prev.map((ticket, i) => 
      i === ticketIndex ? { 
        ...ticket, 
        benefits: ticket.benefits.filter((_, bi) => bi !== benefitIndex) 
      } : ticket
    ));
  };

  const updateBenefit = (ticketIndex: number, benefitIndex: number, value: string) => {
    setTicketTypes(prev => prev.map((ticket, i) => 
      i === ticketIndex ? { 
        ...ticket, 
        benefits: ticket.benefits.map((benefit, bi) => 
          bi === benefitIndex ? value : benefit
        ) 
      } : ticket
    ));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!eventData.title.trim()) newErrors.title = 'Event title is required';
    if (!eventData.description.trim()) newErrors.description = 'Event description is required';
    if (!eventData.startDate) newErrors.startDate = 'Start date is required';
    if (!eventData.endDate) newErrors.endDate = 'End date is required';
    if (!eventData.startTime) newErrors.startTime = 'Start time is required';
    if (!eventData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!eventData.country.trim()) newErrors.country = 'Country is required';

    if (eventData.venueType === 'virtual' && !eventData.virtualLink.trim()) {
      newErrors.virtualLink = 'Virtual link is required for virtual events';
    }

    if (eventData.venueType === 'physical' && !eventData.address.trim()) {
      newErrors.address = 'Address is required for physical events';
    }

    // Validate ticket types
    ticketTypes.forEach((ticket, index) => {
      if (!ticket.name.trim()) {
        newErrors[`ticket-${index}-name`] = 'Ticket name is required';
      }
      if (eventData.eventType === 'paid' && ticket.price < 0) {
        newErrors[`ticket-${index}-price`] = 'Price cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const completeEventData = {
        ...eventData,
        ticketTypes: ticketTypes.filter(ticket => ticket.name.trim()),
        createdAt: new Date().toISOString(),
        id: `event-${Date.now()}`
      };
      onSave(completeEventData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Event Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Event Details
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your event..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image URL
                </label>
                <input
                  type="url"
                  value={eventData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={eventData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="networking">Networking</option>
                  <option value="summit">Summit</option>
                  <option value="webinar">Webinar</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={eventData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="startup, networking, tech"
                />
              </div>
            </div>
          </div>

          {/* Event Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Event Type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  eventData.eventType === 'free' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleEventTypeChange('free')}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="eventType"
                    value="free"
                    checked={eventData.eventType === 'free'}
                    onChange={() => handleEventTypeChange('free')}
                    className="text-green-600"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Free Event</h4>
                    <p className="text-sm text-gray-600">No cost for attendees</p>
                  </div>
                </div>
              </div>

              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  eventData.eventType === 'paid' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleEventTypeChange('paid')}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="eventType"
                    value="paid"
                    checked={eventData.eventType === 'paid'}
                    onChange={() => handleEventTypeChange('paid')}
                    className="text-blue-600"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Paid Event</h4>
                    <p className="text-sm text-gray-600">Charge for tickets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Date & Time
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={eventData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={eventData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Venue Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Type *
                </label>
                <div className="flex space-x-4">
                  {['physical', 'virtual', 'hybrid'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="venueType"
                        value={type}
                        checked={eventData.venueType === type}
                        onChange={(e) => handleInputChange('venueType', e.target.value)}
                        className="mr-2"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={eventData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.venue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter venue name"
                  />
                  {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={eventData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter country"
                  />
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>
              </div>

              {eventData.venueType === 'physical' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={eventData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={eventData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full address"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                </div>
              )}

              {(eventData.venueType === 'virtual' || eventData.venueType === 'hybrid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual Link *
                  </label>
                  <input
                    type="url"
                    value={eventData.virtualLink}
                    onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.virtualLink ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://zoom.us/j/..."
                  />
                  {errors.virtualLink && <p className="mt-1 text-sm text-red-600">{errors.virtualLink}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Types */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Ticket Configuration
              </h3>
              <button
                type="button"
                onClick={addTicketType}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Ticket Type</span>
              </button>
            </div>

            <div className="space-y-6">
              {ticketTypes.map((ticket, ticketIndex) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Ticket Type {ticketIndex + 1}</h4>
                    {ticketTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketType(ticketIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Name *
                      </label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => updateTicketType(ticketIndex, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`ticket-${ticketIndex}-name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., General Admission"
                      />
                      {errors[`ticket-${ticketIndex}-name`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`ticket-${ticketIndex}-name`]}</p>
                      )}
                    </div>

                    {eventData.eventType === 'paid' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(ticketIndex, 'price', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`ticket-${ticketIndex}-price`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {errors[`ticket-${ticketIndex}-price`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ticket-${ticketIndex}-price`]}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={ticket.maxAttendees}
                        onChange={(e) => updateTicketType(ticketIndex, 'maxAttendees', parseInt(e.target.value) || 100)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={ticket.description}
                      onChange={(e) => updateTicketType(ticketIndex, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe what's included with this ticket..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Benefits
                      </label>
                      <button
                        type="button"
                        onClick={() => addBenefit(ticketIndex)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        + Add Benefit
                      </button>
                    </div>
                    <div className="space-y-2">
                      {ticket.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => updateBenefit(ticketIndex, benefitIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter benefit..."
                          />
                          {ticket.benefits.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBenefit(ticketIndex, benefitIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Create Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};