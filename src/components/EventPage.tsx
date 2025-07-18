import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Globe, 
  Plus, 
  Minus, 
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import { TicketType } from '../types';
import { EventCreationForm } from './EventCreationForm';

interface EventPageProps {
  onProceedToUserInfo: (tickets: {[key: string]: number}) => void;
  onViewDashboard: () => void;
}

const ticketTypes: TicketType[] = [
  {
    id: 'attendee',
    name: 'Attendee',
    price: 299,
    description: 'Full access to all sessions and networking',
    benefits: [
      'Access to all keynote sessions',
      'Virtual networking sessions',
      'Access to recorded content',
      'Digital event materials'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'speaker',
    name: 'Speaker',
    price: 199,
    description: 'Special pricing for industry speakers',
    benefits: [
      'All attendee benefits',
      'Speaker lounge access',
      'Pre-event briefing session',
      'Speaking opportunity certificate'
    ],
    color: 'from-orange-500 to-orange-600'
  }
];

export const EventPage: React.FC<EventPageProps> = ({ onProceedToUserInfo, onViewDashboard }) => {
  const [tickets, setTickets] = useState<{[key: string]: number}>({
    attendee: 0,
    speaker: 0
  });

  const [showEventForm, setShowEventForm] = useState(false);

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, prev[ticketId] + change)
    }));
  };

  const getTotalPrice = () => {
    return ticketTypes.reduce((total, ticket) => {
      return total + (tickets[ticket.id] * ticket.price);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(tickets).reduce((sum, count) => sum + count, 0);
  };

  const handleProceed = () => {
    if (getTotalTickets() > 0) {
      onProceedToUserInfo(tickets);
    }
  };

  const handleSaveEvent = (eventData: any) => {
    console.log('New event created:', eventData);
    // In a real app, this would save to a database
    setShowEventForm(false);
    // You could also redirect to the new event page or show a success message
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
              <button 
                onClick={onViewDashboard}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
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
        <button className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Event Header */}
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    LP-GP Summit: Investing in Emerging Market Startups (Virtual)
                  </h1>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Copy className="h-5 w-5" />
                  </button>
                </div>

                {/* Event Image */}
                <div className="mb-8">
                  <img 
                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop" 
                    alt="Event" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start date</p>
                      <p className="font-medium text-gray-900">10/06/2025 12:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End date</p>
                      <p className="font-medium text-gray-900">18/06/2025 12:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue Type</p>
                      <p className="font-medium text-gray-900">Virtual</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Country: India</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-blue-600 hover:text-blue-700">link</a>
                  </div>
                </div>

                {/* Event Description */}
                <div className="border-t border-gray-200 pt-8">
                  <p className="text-gray-700 leading-relaxed">
                    Exclusive dinner with AegisFund's top 5 climate tech startups seeking $2-5M checks. Portfolio includes grid-scale battery and carbon removal tech. Join leading investors and entrepreneurs for an evening of networking and deal flow opportunities in the rapidly growing climate technology sector.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Purchasing Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Tickets</h2>
              
              {/* Ticket Types */}
              <div className="space-y-4 mb-8">
                {ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{ticket.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${ticket.color}`}>
                            ${ticket.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                        <ul className="space-y-1">
                          {ticket.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-xs text-gray-500">
                              <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Quantity</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateTicketQuantity(ticket.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                          disabled={tickets[ticket.id] === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{tickets[ticket.id]}</span>
                        <button
                          onClick={() => updateTicketQuantity(ticket.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              {getTotalTickets() > 0 && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    {ticketTypes.map((ticket) => (
                      tickets[ticket.id] > 0 && (
                        <div key={ticket.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {ticket.name} × {tickets[ticket.id]}
                          </span>
                          <span className="font-medium">${tickets[ticket.id] * ticket.price}</span>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">${getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform ${
                  getTotalTickets() > 0
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600 hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={getTotalTickets() === 0}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>
                    {getTotalTickets() > 0 ? 'Proceed to Checkout' : 'Select Tickets'}
                  </span>
                </div>
              </button>

              {getTotalTickets() > 0 && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Next: Enter your information to complete purchase
                </p>
              )}
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