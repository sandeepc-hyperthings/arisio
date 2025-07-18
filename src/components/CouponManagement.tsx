import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  Percent, 
  DollarSign,
  Calendar,
  Users,
  Tag,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Coupon } from '../types';

interface CouponManagementProps {
  onClose: () => void;
  eventId: string;
  ticketTypes: Array<{ id: string; name: string; price: number }>;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({ 
  onClose, 
  eventId, 
  ticketTypes 
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock coupons data - in real app, this would come from API
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'EARLY20',
      name: 'Early Bird Discount',
      description: '20% off for early registrations',
      discountType: 'percentage',
      discountValue: 20,
      maxUses: 50,
      currentUses: 12,
      validFrom: '2025-01-01',
      validUntil: '2025-02-01',
      isActive: true,
      applicableTicketTypes: ['attendee', 'speaker'],
      minimumPurchase: 100,
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      code: 'SPEAKER50',
      name: 'Speaker Special',
      description: '$50 off for speakers',
      discountType: 'fixed',
      discountValue: 50,
      maxUses: 20,
      currentUses: 5,
      validFrom: '2025-01-01',
      validUntil: '2025-06-01',
      isActive: true,
      applicableTicketTypes: ['speaker'],
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '3',
      code: 'STUDENT15',
      name: 'Student Discount',
      description: '15% off for students',
      discountType: 'percentage',
      discountValue: 15,
      maxUses: 100,
      currentUses: 0,
      validFrom: '2025-01-15',
      validUntil: '2025-06-15',
      isActive: false,
      applicableTicketTypes: ['attendee'],
      createdAt: '2025-01-01T00:00:00Z'
    }
  ]);

  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    maxUses: 100,
    validFrom: '',
    validUntil: '',
    isActive: true,
    applicableTicketTypes: [],
    minimumPurchase: 0
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon(prev => ({ ...prev, code: result }));
  };

  const validateCoupon = (coupon: Partial<Coupon>) => {
    const newErrors: {[key: string]: string} = {};

    if (!coupon.code?.trim()) newErrors.code = 'Coupon code is required';
    if (!coupon.name?.trim()) newErrors.name = 'Coupon name is required';
    if (!coupon.discountValue || coupon.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }
    if (coupon.discountType === 'percentage' && coupon.discountValue > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%';
    }
    if (!coupon.maxUses || coupon.maxUses <= 0) {
      newErrors.maxUses = 'Max uses must be greater than 0';
    }
    if (!coupon.validFrom) newErrors.validFrom = 'Valid from date is required';
    if (!coupon.validUntil) newErrors.validUntil = 'Valid until date is required';
    if (coupon.validFrom && coupon.validUntil && coupon.validFrom >= coupon.validUntil) {
      newErrors.validUntil = 'Valid until date must be after valid from date';
    }
    if (!coupon.applicableTicketTypes?.length) {
      newErrors.applicableTicketTypes = 'Select at least one ticket type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCoupon = () => {
    if (validateCoupon(newCoupon)) {
      const coupon: Coupon = {
        ...newCoupon,
        id: Date.now().toString(),
        currentUses: 0,
        createdAt: new Date().toISOString()
      } as Coupon;

      setCoupons(prev => [...prev, coupon]);
      setNewCoupon({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        maxUses: 100,
        validFrom: '',
        validUntil: '',
        isActive: true,
        applicableTicketTypes: [],
        minimumPurchase: 0
      });
      setActiveTab('list');
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon(coupon);
    setActiveTab('edit');
  };

  const handleUpdateCoupon = () => {
    if (validateCoupon(newCoupon) && editingCoupon) {
      setCoupons(prev => prev.map(c => 
        c.id === editingCoupon.id ? { ...newCoupon, id: editingCoupon.id } as Coupon : c
      ));
      setEditingCoupon(null);
      setNewCoupon({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        maxUses: 100,
        validFrom: '',
        validUntil: '',
        isActive: true,
        applicableTicketTypes: [],
        minimumPurchase: 0
      });
      setActiveTab('list');
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    }
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getUsagePercentage = (coupon: Coupon) => {
    return (coupon.currentUses / coupon.maxUses) * 100;
  };

  const isExpired = (coupon: Coupon) => {
    return new Date(coupon.validUntil) < new Date();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Tag className="h-6 w-6 mr-2 text-blue-600" />
            Coupon Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'list', label: 'Coupons', icon: Tag },
              { id: 'create', label: 'Create New', icon: Plus }
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

        <div className="p-8">
          {/* Coupons List */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Active Coupons</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className={`border rounded-lg p-6 ${
                    coupon.isActive && !isExpired(coupon) 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{coupon.name}</h4>
                          {isExpired(coupon) && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Expired
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCouponStatus(coupon.id)}
                          className={`p-1 rounded ${
                            coupon.isActive ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {coupon.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Discount:</span>
                        <span className="font-medium flex items-center">
                          {coupon.discountType === 'percentage' ? (
                            <>
                              <Percent className="h-4 w-4 mr-1" />
                              {coupon.discountValue}%
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 mr-1" />
                              ${coupon.discountValue}
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Usage:</span>
                        <span className="font-medium">
                          {coupon.currentUses} / {coupon.maxUses}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${getUsagePercentage(coupon)}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Valid until:</span>
                        <span className="font-medium">
                          {new Date(coupon.validUntil).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-500">Applies to:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {coupon.applicableTicketTypes.map(typeId => {
                            const ticketType = ticketTypes.find(t => t.id === typeId);
                            return (
                              <span key={typeId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {ticketType?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {coupons.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
                  <p className="text-gray-500 mb-4">Create your first coupon to offer discounts to your attendees.</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Coupon
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Create/Edit Coupon Form */}
          {(activeTab === 'create' || activeTab === 'edit') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'create' ? 'Create New Coupon' : 'Edit Coupon'}
                </h3>
                <button
                  onClick={() => setActiveTab('list')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.code ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="SAVE20"
                      />
                      <button
                        type="button"
                        onClick={generateCouponCode}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Name *
                    </label>
                    <input
                      type="text"
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Early Bird Discount"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe when and how this coupon should be used..."
                    />
                  </div>
                </div>

                {/* Discount Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Discount Settings</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="discountType"
                          value="percentage"
                          checked={newCoupon.discountType === 'percentage'}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value as 'percentage' }))}
                          className="mr-2"
                        />
                        <Percent className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Percentage</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="discountType"
                          value="fixed"
                          checked={newCoupon.discountType === 'fixed'}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value as 'fixed' }))}
                          className="mr-2"
                        />
                        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                        <span>Fixed Amount</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={newCoupon.discountType === 'percentage' ? 100 : undefined}
                        step={newCoupon.discountType === 'percentage' ? 1 : 0.01}
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.discountValue ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={newCoupon.discountType === 'percentage' ? '20' : '50.00'}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">
                          {newCoupon.discountType === 'percentage' ? '%' : '$'}
                        </span>
                      </div>
                    </div>
                    {errors.discountValue && <p className="mt-1 text-sm text-red-600">{errors.discountValue}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Uses *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.maxUses}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.maxUses ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="100"
                    />
                    {errors.maxUses && <p className="mt-1 text-sm text-red-600">{errors.maxUses}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Purchase Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newCoupon.minimumPurchase}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, minimumPurchase: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Leave 0 for no minimum purchase requirement</p>
                  </div>
                </div>

                {/* Validity Period */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Validity Period</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid From *
                      </label>
                      <input
                        type="date"
                        value={newCoupon.validFrom}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, validFrom: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.validFrom ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.validFrom && <p className="mt-1 text-sm text-red-600">{errors.validFrom}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid Until *
                      </label>
                      <input
                        type="date"
                        value={newCoupon.validUntil}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, validUntil: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.validUntil ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.validUntil && <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>}
                    </div>
                  </div>
                </div>

                {/* Applicable Ticket Types */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Applicable Ticket Types</h4>
                  
                  <div className="space-y-2">
                    {ticketTypes.map((ticketType) => (
                      <label key={ticketType.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={newCoupon.applicableTicketTypes?.includes(ticketType.id)}
                          onChange={(e) => {
                            const types = newCoupon.applicableTicketTypes || [];
                            if (e.target.checked) {
                              setNewCoupon(prev => ({ 
                                ...prev, 
                                applicableTicketTypes: [...types, ticketType.id] 
                              }));
                            } else {
                              setNewCoupon(prev => ({ 
                                ...prev, 
                                applicableTicketTypes: types.filter(id => id !== ticketType.id) 
                              }));
                            }
                          }}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{ticketType.name}</span>
                          <span className="text-sm text-gray-500 ml-2">${ticketType.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.applicableTicketTypes && (
                    <p className="text-sm text-red-600">{errors.applicableTicketTypes}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Status</h4>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCoupon.isActive}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active (users can use this coupon)</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={activeTab === 'create' ? handleCreateCoupon : handleUpdateCoupon}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  {activeTab === 'create' ? 'Create Coupon' : 'Update Coupon'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};