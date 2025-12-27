import express from 'express';
import { Event, EventSchema } from '../../common/Event.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Router for event-related endpoints
 */
export const eventRouter = express.Router();

// In-memory storage (replace with database in production)
const events: Map<string, Event> = new Map();

/**
 * GET /api/events - Retrieve all events
 */
eventRouter.get('/', (req, res) => {
  const eventList = Array.from(events.values()).map((event) => event.toObject());
  res.json(eventList);
});

/**
 * GET /api/events/:id - Retrieve a specific event by ID
 */
eventRouter.get('/:id', (req, res) => {
  const event = events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event.toObject());
});

/**
 * POST /api/events - Create a new event
 */
eventRouter.post('/', (req, res) => {
  try {
    const eventData = {
      ...req.body,
      id: uuidv4(),
    };

    const event = Event.fromObject(eventData);
    events.set(event.id, event);

    res.status(201).json(event.toObject());
  } catch (error) {
    res.status(400).json({ error: 'Invalid event data', details: error });
  }
});

/**
 * PUT /api/events/:id - Update an existing event
 */
eventRouter.put('/:id', (req, res) => {
  const existingEvent = events.get(req.params.id);
  if (!existingEvent) {
    return res.status(404).json({ error: 'Event not found' });
  }

  try {
    const eventData = {
      ...req.body,
      id: req.params.id,
    };

    const updatedEvent = Event.fromObject(eventData);
    events.set(updatedEvent.id, updatedEvent);

    res.json(updatedEvent.toObject());
  } catch (error) {
    res.status(400).json({ error: 'Invalid event data', details: error });
  }
});

/**
 * DELETE /api/events/:id - Delete an event
 */
eventRouter.delete('/:id', (req, res) => {
  const deleted = events.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.status(204).send();
});
