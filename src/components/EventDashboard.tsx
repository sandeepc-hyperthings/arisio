import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Globe, 
  Users, 
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  Edit,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Mail,
  Phone,
  Building,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { EventCreationForm } from './EventCreationForm';

interface EventDashboardProps {
  onBack: () => void;
}

interface TicketSale {
  id: string;
  ticketNumber: string;
  ticketType: string;
  holderName: string;
  holderEmail: string;
  holderPhone: string;
  company: string;
  purchaseDate: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface SalesData {
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
  conversionRate: number;
  salesByType: { [key: string]: { count: number; revenue: number } };
  salesByDate: { date: string; sales: number; revenue: number }[];
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'attendees'>('overview');
  const [showEventForm, setShowEventForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  // Mock data - in a real app, this would come from an API
  const eventData = {
    id: 'event-1',
    title: 'LP-GP Summit: Investing in Emerging Market Startups (Virtual)',
    description: 'Exclusive dinner with AegisFund\'s top 5 climate tech startups seeking $2-5M checks. Portfolio includes grid-scale battery and carbon removal tech.',
    startDate: '2025-06-10',
    endDate: '2025-06-18',
    startTime: '12:00',
    venue: 'Virtual Event',
    venueType: 'virtual',
    country: 'India',
    imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    status: 'active',
    createdAt: '2025-01-01',
    ticketTypes: [
      { id: 'attendee', name: 'Attendee', price: 299, maxAttendees: 100 },
      { id: 'speaker', name: 'Speaker', price: 199, maxAttendees: 20 }
    ]
  };

  const salesData: SalesData = {
    totalRevenue: 12450,
    totalTicketsSold: 47,
    totalAttendees: 47,
    conversionRate: 23.5,
    salesByType: {
      'Attendee': { count: 32, revenue: 9568 },
      'Speaker': { count: 15, revenue: 2985 }
    },
    salesByDate: [
      { date: '2025-01-01', sales: 5, revenue: 1495 },
      { date: '2025-01-02', sales: 8, revenue: 2392 },
      { date: '2025-01-03', sales: 12, revenue: 3588 },
      { date: '2025-01-04', sales: 7, revenue: 2093 },
      { date: '2025-01-05', sales: 9, revenue: 2691 },
      { date: '2025-01-06', sales: 6, revenue: 1794 }
    ]
  };

  const ticketSales: TicketSale[] = [
    {
      id: '1',
      ticketNumber: 'TKT-001',
      ticketType: 'Attendee',
      holderName: 'John Smith',
      holderEmail: 'john@example.com',
      holderPhone: '+1-555-0123',
      company: 'Tech Corp',
      purchaseDate: '2025-01-01T10:30:00Z',
      price: 299,
      status: 'confirmed'
    },
    {
      id: '2',
      ticketNumber: 'TKT-002',
      ticketType: 'Speaker',
      holderName: 'Sarah Johnson',
      holderEmail: 'sarah@startup.com',
      holderPhone: '+1-555-0124',
      company: 'Innovation Labs',
      purchaseDate: '2025-01-01T14:15:00Z',
      price: 199,
      status: 'confirmed'
    },
    {
      id: '3',
      ticketNumber: 'TKT-003',
      ticketType: 'Attendee',
      holderName: 'Mike Chen',
      holderEmail: 'mike@venture.com',
      holderPhone: '+1-555-0125',
      company: 'Venture Capital Inc',
      purchaseDate: '2025-01-02T09:45:00Z',
      price: 299,
      status: 'pending'
    }
  ];

  const filteredSales = ticketSales.filter(sale => {
    const matchesSearch = sale.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.holderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sale.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSaveEvent = (eventData: any) => {
    console.log('Event updated:', eventData);
    setShowEventForm(false);
  };

  const exportData = (type: 'sales' | 'attendees') => {
    const data = type === 'sales' ? ticketSales : ticketSales;
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img 
              src={eventData.imageUrl} 
              alt="Event" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowEventForm(true)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Event</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{eventData.title}</h1>
                <p className="text-gray-600">{eventData.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  eventData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {eventData.status === 'active' ? 'Active' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="font-medium text-gray-900">{eventData.startDate} - {eventData.endDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium text-gray-900">{eventData.venue}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-gray-900">{eventData.country}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium text-gray-900">{eventData.startTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'sales', label: 'Sales Report', icon: DollarSign },
                { id: 'attendees', label: 'Attendees', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Revenue</p>
                        <p className="text-2xl font-bold">${salesData.totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Tickets Sold</p>
                        <p className="text-2xl font-bold">{salesData.totalTicketsSold}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Attendees</p>
                        <p className="text-2xl font-bold">{salesData.totalAttendees}</p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Conversion Rate</p>
                        <p className="text-2xl font-bold">{salesData.conversionRate}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Sales by Ticket Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                      Sales by Ticket Type
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(salesData.salesByType).map(([type, data]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              type === 'Attendee' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}></div>
                            <span className="font-medium text-gray-900">{type}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{data.count} tickets</p>
                            <p className="text-sm text-gray-500">${data.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Daily Sales Trend
                    </h3>
                    <div className="space-y-3">
                      {salesData.salesByDate.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day.date}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-900">{day.sales} sales</span>
                            <span className="text-sm text-green-600">${day.revenue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Report Tab */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Report</h3>
                  <button
                    onClick={() => exportData('sales')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or ticket number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Sales Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{sale.ticketNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{sale.holderName}</div>
                              <div className="text-sm text-gray-500">{sale.holderEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              sale.ticketType === 'Attendee' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {sale.ticketType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(sale.purchaseDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${sale.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              sale.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : sale.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Attendee List</h3>
                  <button
                    onClick={() => exportData('attendees')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Attendees</span>
                  </button>
                </div>

                {/* Attendee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSales.map((attendee) => (
                    <div key={attendee.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{attendee.holderName}</h4>
                          <p className="text-sm text-gray-500">{attendee.ticketType} Ticket</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attendee.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : attendee.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{attendee.holderEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{attendee.holderPhone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          <span>{attendee.company}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Ticket: {attendee.ticketNumber}</span>
                          <span className="font-medium text-gray-900">${attendee.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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