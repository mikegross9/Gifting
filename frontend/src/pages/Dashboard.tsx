import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { giftsApi, eventsApi, contactsApi } from '../services/api';
import { Gift as GiftType, Event, Contact } from '../types';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [pendingGifts, setPendingGifts] = useState<GiftType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [contactCount, setContactCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gifts, events, contacts] = await Promise.all([
        giftsApi.getPending(),
        eventsApi.getUpcoming(30),
        contactsApi.getAll()
      ]);

      setPendingGifts(gifts);
      setUpcomingEvents(events);
      setContactCount(contacts.length);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (giftId: string) => {
    try {
      await giftsApi.approve(giftId);
      await loadData();
    } catch (error) {
      console.error('Failed to approve gift:', error);
      alert('Failed to approve gift. Please try again.');
    }
  };

  const handleReject = async (giftId: string) => {
    try {
      await giftsApi.reject(giftId);
      await loadData();
    } catch (error) {
      console.error('Failed to reject gift:', error);
      alert('Failed to reject gift. Please try again.');
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your gifts and never forget an occasion</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contacts</p>
                <p className="text-2xl font-semibold text-gray-900">{contactCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingGifts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        {pendingGifts.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Gift Approvals
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {pendingGifts.map((gift) => (
                <div key={gift.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{gift.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        For: <span className="font-medium">{gift.contact?.name}</span>
                        {gift.event && ` - ${gift.event.name}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: <span className="font-medium">${gift.price.toFixed(2)}</span>
                      </p>
                      {gift.description && (
                        <p className="text-sm text-gray-600 mt-2">{gift.description}</p>
                      )}
                      {gift.cardMessage && (
                        <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-sm text-gray-700 italic">"{gift.cardMessage}"</p>
                        </div>
                      )}
                      {gift.approvalDeadline && (
                        <p className="text-sm text-red-600 mt-2">
                          Approve by: {format(new Date(gift.approvalDeadline), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                    {gift.imageUrl && (
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        className="ml-4 w-24 h-24 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleApprove(gift.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve & Order
                    </button>
                    <Link
                      to={`/gifts/${gift.id}`}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Modify
                    </Link>
                    <button
                      onClick={() => handleReject(gift.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events (Next 30 Days)</h2>
          </div>
          <div className="p-6">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{event.name}</p>
                        <p className="text-sm text-gray-600">
                          {event.contact?.name} - {format(new Date(event.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.gifts && event.gifts.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Gift className="h-3 w-3 mr-1" />
                          Gift planned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/contacts?new=true"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <Users className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Add Contact</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new person to track gifts for</p>
          </Link>

          <Link
            to="/events"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <Calendar className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">View All Events</h3>
            <p className="text-sm text-gray-600 mt-1">See all upcoming birthdays and holidays</p>
          </Link>

          <Link
            to="/gifts"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <Gift className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Gift History</h3>
            <p className="text-sm text-gray-600 mt-1">View all ordered and delivered gifts</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
