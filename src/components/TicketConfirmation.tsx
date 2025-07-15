import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  Ticket,
  Plus
} from 'lucide-react';
import { PurchasedTicket } from '../types';
import { EventCreationForm } from './EventCreationForm';

interface TicketConfirmationProps {
  tickets: PurchasedTicket[];
  onBackToEvents: () => void;
}

export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({ 
  tickets, 
  onBackToEvents 
}) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.ticketType.price, 0);

  const downloadTicket = (ticket: PurchasedTicket) => {
    // In a real app, this would generate a PDF or image file
    const ticketData = `
Event: ${ticket.eventName}
Ticket Type: ${ticket.ticketType.name}
Ticket Number: ${ticket.ticketNumber}
Date: ${ticket.eventDate}
Venue: ${ticket.venue}
Holder: ${ticket.holderName}
    `.trim();
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.ticketNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          onClick={onBackToEvents}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your tickets have been confirmed. Check your email for additional details.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
                <p className="text-sm text-gray-500">Tickets</p>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${totalAmount}</p>
                <p className="text-sm text-gray-500">Total Paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Event Date</p>
                <p className="font-medium text-gray-900">10/06/2025 - 18/06/2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium text-gray-900">Virtual Event</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">12:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Tickets</h2>
          
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <Ticket className="h-6 w-6" />
                    <div>
                      <h3 className="font-bold text-lg">{ticket.ticketType.name} Ticket</h3>
                      <p className="text-blue-100">#{ticket.ticketNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${ticket.ticketType.price}</p>
                    <p className="text-blue-100">Ticket {index + 1}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ticket Details */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-4">Ticket Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Event Name</p>
                        <p className="font-medium text-gray-900">{ticket.eventName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ticket Holder</p>
                        <p className="font-medium text-gray-900">{ticket.holderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Purchase Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ticket Type</p>
                        <p className="font-medium text-gray-900">{ticket.ticketType.name}</p>
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Included Benefits</h5>
                      <ul className="space-y-1">
                        {ticket.ticketType.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <h5 className="font-medium text-gray-900 mb-4">Entry QR Code</h5>
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                      {ticket.qrCode ? (
                        <img 
                          src={ticket.qrCode} 
                          alt="QR Code" 
                          className="w-32 h-32"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-500 text-xs text-center">QR Code Loading...</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-4">
                      Show this QR code at the event entrance
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadTicket(ticket)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Please arrive 15 minutes before the event start time</li>
            <li>• Keep your QR code ready for quick entry</li>
            <li>• Check your email for event updates and joining instructions</li>
            <li>• For virtual events, you'll receive the meeting link 24 hours before</li>
            <li>• Contact support if you need to transfer or modify your tickets</li>
          </ul>
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