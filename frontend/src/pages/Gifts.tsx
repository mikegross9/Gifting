import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { giftsApi } from '../services/api';
import { Gift, GiftStatus } from '../types';
import Layout from '../components/Layout';

export default function Gifts() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<GiftStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      const data = await giftsApi.getAll();
      setGifts(data);
    } catch (error) {
      console.error('Failed to load gifts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: GiftStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'APPROVED':
      case 'ORDERED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'DELIVERED':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: GiftStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
      case 'ORDERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGifts = filter === 'ALL' ? gifts : gifts.filter(g => g.status === filter);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gifts</h1>
          <p className="text-gray-600 mt-1">Track all your gift orders and history</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'ALL'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({gifts.length})
            </button>
            <button
              onClick={() => setFilter('PENDING_APPROVAL')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'PENDING_APPROVAL'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({gifts.filter(g => g.status === 'PENDING_APPROVAL').length})
            </button>
            <button
              onClick={() => setFilter('ORDERED')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'ORDERED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ordered ({gifts.filter(g => g.status === 'ORDERED').length})
            </button>
            <button
              onClick={() => setFilter('SHIPPED')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'SHIPPED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shipped ({gifts.filter(g => g.status === 'SHIPPED').length})
            </button>
            <button
              onClick={() => setFilter('DELIVERED')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'DELIVERED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivered ({gifts.filter(g => g.status === 'DELIVERED').length})
            </button>
          </div>
        </div>

        {/* Gifts List */}
        <div className="bg-white rounded-lg shadow">
          {filteredGifts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No gifts found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredGifts.map((gift) => (
                <div key={gift.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {gift.imageUrl && (
                        <img
                          src={gift.imageUrl}
                          alt={gift.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{gift.name}</h3>
                        {gift.description && (
                          <p className="text-sm text-gray-600 mt-1">{gift.description}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            For: <span className="font-medium">{gift.contact?.name}</span>
                            {gift.event && ` - ${gift.event.name}`}
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            ${gift.price.toFixed(2)}
                          </p>
                        </div>
                        {gift.cardMessage && (
                          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="text-sm text-gray-700 italic">
                              "{gift.cardMessage}"
                            </p>
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                          {gift.orderedAt && (
                            <span>Ordered: {format(new Date(gift.orderedAt), 'MMM d, yyyy')}</span>
                          )}
                          {gift.shippedAt && (
                            <span>Shipped: {format(new Date(gift.shippedAt), 'MMM d, yyyy')}</span>
                          )}
                          {gift.deliveredAt && (
                            <span>Delivered: {format(new Date(gift.deliveredAt), 'MMM d, yyyy')}</span>
                          )}
                        </div>
                        {gift.url && (
                          <a
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                          >
                            View product →
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(gift.status)}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(gift.status)}`}>
                          {gift.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
