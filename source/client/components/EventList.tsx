import React, { useState, useEffect } from 'react';
import { Event, EventType } from '../../common/Event.js';

/**
 * Event list component - displays all events
 */
export const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches events from the API
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes an event
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="event-list">
      <h2>Events</h2>
      {events.length === 0 ? (
        <p>No events found. Create your first event!</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              style={{ borderLeftColor: event.color }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="event-details">
                <span className="event-cost">
                  ${event.financialCost.toFixed(2)}
                </span>
                <span className="event-recurrence">{event.recurrence}</span>
                <span className="event-date">
                  {event.date.type === 'iso'
                    ? `W${event.date.value.isoWeek} D${event.date.value.dayOffset}`
                    : `${event.date.value.month}/${event.date.value.day}`}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
