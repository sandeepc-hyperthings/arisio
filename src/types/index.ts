export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  color: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
}

export interface TicketHolder extends UserInfo {
  ticketId: string;
  ticketType: string;
  ticketName: string;
}

export interface PurchasedTicket {
  id: string;
  ticketNumber: string;
  ticketType: TicketType;
  holderName: string;
  holderEmail: string;
  eventName: string;
  eventDate: string;
  venue: string;
  purchaseDate: string;
  qrCode: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  currentUses: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableTicketTypes: string[]; // ticket type IDs
  minimumPurchase?: number;
  createdAt: string;
}