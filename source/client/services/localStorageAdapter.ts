import type { EventType } from '../../common/types/EventType';
import type { EventApiAdapter, ImportResult } from './eventApi';
import { Event } from '../../common/Event';

const STORAGE_KEY = 'iso-calendar-events';

/**
 * Generate a simple UUID v4
 */
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Load events from localStorage
 */
const loadEvents = (): EventType[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    // Validate events using Event class
    return parsed.map((data: unknown) => Event.fromObject(data).toObject());
  } catch (error) {
    console.error('Failed to load events from localStorage:', error);
    return [];
  }
};

/**
 * Save events to localStorage
 */
const saveEvents = (events: EventType[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events to localStorage:', error);
    throw new Error('Failed to save events');
  }
};

/**
 * Parse CSV file and extract events
 */
const parseCSV = async (file: File): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length === 0) {
          resolve([]);
          return;
        }

        // Parse header
        const header = lines[0].split(',').map((h) => h.trim());

        // Parse rows
        const events = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim());
          const obj: Record<string, string> = {};
          header.forEach((key, index) => {
            obj[key] = values[index] || '';
          });
          return obj;
        });

        resolve(events);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * LocalStorage adapter for event API
 */
export const localStorageAdapter: EventApiAdapter = {
  /**
   * Fetch all events from localStorage
   */
  fetchEvents: async (): Promise<EventType[]> => {
    // Simulate network delay for more realistic demo
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadEvents();
  },

  /**
   * Create a new event in localStorage
   */
  createEvent: async (eventData: Omit<EventType, 'id'>): Promise<EventType> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const events = loadEvents();
    const newEvent: EventType = {
      ...eventData,
      id: generateId(),
    };

    // Validate the event
    Event.fromObject(newEvent);

    events.push(newEvent);
    saveEvents(events);

    return newEvent;
  },

  /**
   * Update an existing event in localStorage
   */
  updateEvent: async (id: string, eventData: EventType): Promise<EventType> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const events = loadEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error(`Event with id ${id} not found`);
    }

    // Validate the event
    Event.fromObject(eventData);

    events[index] = eventData;
    saveEvents(events);

    return eventData;
  },

  /**
   * Delete a single event from localStorage
   */
  deleteEvent: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const events = loadEvents();
    const filtered = events.filter((e) => e.id !== id);

    if (filtered.length === events.length) {
      throw new Error(`Event with id ${id} not found`);
    }

    saveEvents(filtered);
  },

  /**
   * Delete all events from localStorage
   */
  deleteAllEvents: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    saveEvents([]);
  },

  /**
   * Import events from CSV file
   */
  importEventsFromCSV: async (file: File): Promise<ImportResult> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const result: ImportResult = {
      success: 0,
      updated: 0,
      errors: [],
    };

    try {
      const rows = await parseCSV(file);
      const events = loadEvents();

      for (const row of rows) {
        try {
          const event = Event.fromObject(row);
          const eventObj = event.toObject();

          // Check if event with same ID exists
          const existingIndex = events.findIndex((e) => e.id === eventObj.id);

          if (existingIndex !== -1) {
            events[existingIndex] = eventObj;
            result.updated++;
          } else {
            events.push(eventObj);
            result.success++;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Failed to import event: ${errorMessage}`);
        }
      }

      saveEvents(events);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Failed to parse CSV: ${errorMessage}`);
    }

    return result;
  },
};
