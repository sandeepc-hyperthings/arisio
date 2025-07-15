import React, { useState } from 'react';
import { EventPage } from './components/EventPage';
import { UserInfoForm } from './components/UserInfoForm';
import { TicketConfirmation } from './components/TicketConfirmation';
import { TicketType, TicketHolder, PurchasedTicket } from './types';
import { generateTicket } from './utils/ticketGenerator';

type AppView = 'event' | 'userInfo' | 'confirmation';

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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('event');
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({});
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProceedToUserInfo = (tickets: {[key: string]: number}) => {
    setSelectedTickets(tickets);
    setCurrentView('userInfo');
  };

  const handleBackToEvent = () => {
    setCurrentView('event');
  };

  const handleUserInfoSubmit = async (ticketHolders: TicketHolder[]) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate purchased tickets
    const ticketPromises = ticketHolders.map((holder, index) => {
      const ticketType = ticketTypes.find(t => t.id === holder.ticketType);
      if (!ticketType) throw new Error('Invalid ticket type');
      
      return generateTicket({
        ticketType,
        holderName: `${holder.firstName} ${holder.lastName}`,
        holderEmail: holder.email,
        eventName: 'LP-GP Summit: Investing in Emerging Market Startups (Virtual)',
        eventDate: '10/06/2025 - 18/06/2025',
        venue: 'Virtual Event'
      });
    });
    
    const tickets: PurchasedTicket[] = await Promise.all(ticketPromises);
    
    setPurchasedTickets(tickets);
    setIsProcessing(false);
    setCurrentView('confirmation');
  };

  const handleBackToEvents = () => {
    setCurrentView('event');
    setSelectedTickets({});
    setPurchasedTickets([]);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return ticketTypes.reduce((total, ticket) => {
      return total + (selectedTickets[ticket.id] || 0) * ticket.price;
    }, 0);
  };

  if (currentView === 'userInfo') {
    return (
      <UserInfoForm
        onSubmit={handleUserInfoSubmit}
        onBack={handleBackToEvent}
        selectedTickets={selectedTickets}
        ticketTypes={ticketTypes}
        totalTickets={getTotalTickets()}
        totalPrice={getTotalPrice()}
        isProcessing={isProcessing}
      />
    );
  }

  if (currentView === 'confirmation') {
    return (
      <TicketConfirmation
        tickets={purchasedTickets}
        onBackToEvents={handleBackToEvents}
      />
    );
  }

  return (
    <EventPage onProceedToUserInfo={handleProceedToUserInfo} />
  );
};

export default App;