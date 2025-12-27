import React, { useState, useEffect } from 'react';
import { Event, EventType } from '../../common/Event.js';
import { doesEventOccurOnISODate } from '../../common/EventRecurrence.js';
import * as eventApi from '../services/eventApi.js';

/**
 * Event list props
 */
type EventListProps = {
  refreshTrigger?: number;
  onEditEvent?: (event: EventType) => void;
};

/**
 * Gets the ISO week number for a given date
 */
const getISOWeek = (date: Date): number => {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

/**
 * Gets the date of the Monday in a given ISO week
 */
const getDateOfISOWeek = (year: number, week: number): Date => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const isoWeekStart = simple;
  if (dow <= 4) {
    isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return isoWeekStart;
};

/**
 * Finds the next occurrence of an event as both ISO and Normal dates
 */
const getNextOccurrence = (event: EventType): { isoDate: string; normalDate: string } => {
  // For non-recurring events, directly return the event's date
  if (event.recurrence === 'None') {
    if (event.date.type === 'iso') {
      const { year, isoWeek, dayOffset } = event.date.value;
      const monday = getDateOfISOWeek(year, isoWeek);
      const normalDate = new Date(monday);
      normalDate.setDate(monday.getDate() + dayOffset);

      const normalMonth = normalDate.getMonth() + 1;
      const normalDay = normalDate.getDate();

      const isoDate = `${year}-${String(isoWeek).padStart(2, '0')}-${dayOffset + 1}`;
      const normalDateStr = `${year}-${String(normalMonth).padStart(2, '0')}-${String(normalDay).padStart(2, '0')}`;

      return { isoDate, normalDate: normalDateStr };
    } else {
      const { year, month, day } = event.date.value;
      const normalDateObj = new Date(year, month - 1, day);
      const isoWeek = getISOWeek(normalDateObj);
      const dayOffset = (normalDateObj.getDay() + 6) % 7;

      const isoDate = `${year}-${String(isoWeek).padStart(2, '0')}-${dayOffset + 1}`;
      const normalDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      return { isoDate, normalDate };
    }
  }

  // For recurring events, find the next occurrence
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Search up to 10 years in the future for recurring events
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 10);

  let currentDate = new Date(today);

  while (currentDate <= maxDate) {
    const year = currentDate.getFullYear();
    const isoWeek = getISOWeek(currentDate);
    const dayOffset = (currentDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const eventObj = Event.fromObject(event);
    if (doesEventOccurOnISODate(eventObj, year, isoWeek, dayOffset)) {
      // Found next occurrence
      const normalMonth = currentDate.getMonth() + 1;
      const normalDay = currentDate.getDate();

      // Format ISO date as YYYY-WW-DD (with day offset starting from 1)
      const isoDate = `${year}-${String(isoWeek).padStart(2, '0')}-${dayOffset + 1}`;

      // Format normal date as YYYY-MM-DD
      const normalDate = `${year}-${String(normalMonth).padStart(2, '0')}-${String(normalDay).padStart(2, '0')}`;

      return { isoDate, normalDate };
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // No occurrence found
  return { isoDate: 'N/A', normalDate: 'N/A' };
};

/**
 * Event list component - displays all events
 */
export const EventList: React.FC<EventListProps> = ({ refreshTrigger, onEditEvent }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches events from the API
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventApi.fetchEvents();
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
      await eventApi.deleteEvent(id);
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  /**
   * Deletes all events after confirmation
   */
  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete all ${events.length} events? This action cannot be undone.`)) {
      return;
    }

    try {
      await eventApi.deleteAllEvents();
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h2>Events</h2>
        {events.length > 0 && (
          <button
            className="delete-all-btn"
            onClick={handleDeleteAll}
          >
            Delete All
          </button>
        )}
      </div>
      {events.length === 0 ? (
        <p>No events found. Create your first event!</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => {
            const nextOccurrence = getNextOccurrence(event);
            return (
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
                  {event.recurrence !== 'None' && (
                    <span className="event-recurrence">{event.recurrence}</span>
                  )}
                </div>
                <div className="event-next-occurrence">
                  <div className="occurrence-row">
                    <span className="occurrence-label">ISO:</span>
                    <span className="occurrence-value">{nextOccurrence.isoDate}</span>
                  </div>
                  <div className="occurrence-row">
                    <span className="occurrence-label">Normal:</span>
                    <span className="occurrence-value">{nextOccurrence.normalDate}</span>
                  </div>
                </div>
                <div className="event-actions">
                  {onEditEvent && (
                    <button
                      className="edit-btn"
                      onClick={() => onEditEvent(event)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
