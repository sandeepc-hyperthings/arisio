import QRCode from 'qrcode';
import { TicketType, PurchasedTicket } from '../types';

interface GenerateTicketParams {
  ticketType: TicketType;
  holderName: string;
  holderEmail: string;
  eventName: string;
  eventDate: string;
  venue: string;
}

export const generateTicket = async (params: GenerateTicketParams): Promise<PurchasedTicket> => {
  const {
    ticketType,
    holderName,
    holderEmail,
    eventName,
    eventDate,
    venue
  } = params;

  // Generate unique ticket number
  const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Generate QR code data
  const qrData = JSON.stringify({
    ticketNumber,
    eventName,
    holderName,
    holderEmail,
    ticketType: ticketType.name,
    eventDate,
    venue
  });

  // Generate QR code image
  let qrCode: string;
  try {
    qrCode = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    qrCode = '';
  }

  return {
    id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ticketNumber,
    ticketType,
    holderName,
    holderEmail,
    eventName,
    eventDate,
    venue,
    purchaseDate: new Date().toISOString(),
    qrCode
  };
};

export const generateTicketNumber = (): string => {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const generateQRCode = async (data: any): Promise<string> => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};