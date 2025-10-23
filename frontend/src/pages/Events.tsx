import { useEffect, useState } from 'react';
import { Calendar, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { eventsApi } from '../services/api';
import { Event } from '../types';
import Layout from '../components/Layout';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventsApi.getUpcoming(90); // Get next 90 days
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      BIRTHDAY: 'bg-purple-100 text-purple-800',
      MOTHERS_DAY: 'bg-pink-100 text-pink-800',
      FATHERS_DAY: 'bg-blue-100 text-blue-800',
      VALENTINES_DAY: 'bg-red-100 text-red-800',
      CHRISTMAS: 'bg-green-100 text-green-800',
      ANNIVERSARY: 'bg-yellow-100 text-yellow-800',
      CUSTOM: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Upcoming birthdays and special occasions</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming events in the next 90 days</p>
              <p className="text-sm text-gray-400 mt-2">Add contacts with birthdays to see them here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.contact?.name} - {event.contact?.relationship}
                        </p>
                        <p className="text-sm text-gray-900 mt-2 font-medium">
                          {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        {event.recurring && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                            Annual
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.replace('_', ' ')}
                      </span>
                      {event.gifts && event.gifts.length > 0 && (
                        <div className="flex items-center text-sm text-green-600">
                          <Gift className="h-4 w-4 mr-1" />
                          {event.gifts.length} gift{event.gifts.length > 1 ? 's' : ''} planned
                        </div>
                      )}
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
