import type { EventType } from '../../common/types/EventType';

/**
 * Result of CSV import operation
 */
export type ImportResult = {
  success: number;
  updated: number;
  errors: string[];
};

/**
 * Interface for event API operations
 */
export type EventApiAdapter = {
  /**
   * Fetch all events
   */
  fetchEvents: () => Promise<EventType[]>;

  /**
   * Create a new event
   * @param eventData - Event data without ID (ID will be generated)
   */
  createEvent: (eventData: Omit<EventType, 'id'>) => Promise<EventType>;

  /**
   * Update an existing event
   * @param id - Event ID
   * @param eventData - Complete event data including ID
   */
  updateEvent: (id: string, eventData: EventType) => Promise<EventType>;

  /**
   * Delete a single event
   * @param id - Event ID to delete
   */
  deleteEvent: (id: string) => Promise<void>;

  /**
   * Delete all events
   */
  deleteAllEvents: () => Promise<void>;

  /**
   * Import events from CSV file
   * @param file - CSV file to import
   */
  importEventsFromCSV: (file: File) => Promise<ImportResult>;
};

/**
 * Current API adapter instance
 */
let currentAdapter: EventApiAdapter;

/**
 * Set the API adapter to use
 * @param adapter - The adapter to use for API calls
 */
export const setEventApiAdapter = (adapter: EventApiAdapter): void => {
  currentAdapter = adapter;
};

/**
 * Get the current API adapter
 */
export const getEventApiAdapter = (): EventApiAdapter => {
  if (!currentAdapter) {
    throw new Error('Event API adapter not initialized');
  }
  return currentAdapter;
};

/**
 * Fetch all events
 */
export const fetchEvents = (): Promise<EventType[]> =>
  getEventApiAdapter().fetchEvents();

/**
 * Create a new event
 * @param eventData - Event data without ID
 */
export const createEvent = (eventData: Omit<EventType, 'id'>): Promise<EventType> =>
  getEventApiAdapter().createEvent(eventData);

/**
 * Update an existing event
 * @param id - Event ID
 * @param eventData - Complete event data
 */
export const updateEvent = (id: string, eventData: EventType): Promise<EventType> =>
  getEventApiAdapter().updateEvent(id, eventData);

/**
 * Delete a single event
 * @param id - Event ID to delete
 */
export const deleteEvent = (id: string): Promise<void> =>
  getEventApiAdapter().deleteEvent(id);

/**
 * Delete all events
 */
export const deleteAllEvents = (): Promise<void> =>
  getEventApiAdapter().deleteAllEvents();

/**
 * Import events from CSV file
 * @param file - CSV file to import
 */
export const importEventsFromCSV = (file: File): Promise<ImportResult> =>
  getEventApiAdapter().importEventsFromCSV(file);
