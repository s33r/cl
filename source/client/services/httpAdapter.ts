import type { EventType } from '../../common/types/EventType';
import type { EventApiAdapter, ImportResult } from './eventApi';

/**
 * HTTP adapter for event API using the backend server
 */
export const httpAdapter: EventApiAdapter = {
  /**
   * Fetch all events from the server
   */
  fetchEvents: async (): Promise<EventType[]> => {
    const response = await fetch('/api/events');
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Create a new event on the server
   */
  createEvent: async (eventData: Omit<EventType, 'id'>): Promise<EventType> => {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update an existing event on the server
   */
  updateEvent: async (id: string, eventData: EventType): Promise<EventType> => {
    const response = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete a single event from the server
   */
  deleteEvent: async (id: string): Promise<void> => {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  },

  /**
   * Delete all events from the server
   */
  deleteAllEvents: async (): Promise<void> => {
    // First fetch all events to get their IDs
    const events = await httpAdapter.fetchEvents();

    // Delete each event
    await Promise.all(events.map((event) => httpAdapter.deleteEvent(event.id)));
  },

  /**
   * Import events from CSV file via the server
   */
  importEventsFromCSV: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('csvFile', file);

    const response = await fetch('/api/events/import', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to import events: ${response.statusText}`);
    }

    return response.json();
  },
};
