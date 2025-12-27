import express from 'express';
import multer from 'multer';
import { Event, EventSchema } from '../../common/Event.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Router for event-related endpoints
 */
export const eventRouter = express.Router();

// In-memory storage (replace with database in production)
const events: Map<string, Event> = new Map();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

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

/**
 * POST /api/events/import - Import events from CSV file
 */
eventRouter.post('/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const csvContent = req.file.buffer.toString('utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return res.status(400).json({ error: 'Empty CSV file' });
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const errors: string[] = [];
  let successCount = 0;
  let updateCount = 0;

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Build event data object
      const dateType = row.dateType === 'normal' ? 'normal' : 'iso';
      const eventData: any = {
        id: row.id || uuidv4(),
        title: row.title,
        description: row.description || '',
        financialCost: parseFloat(row.financialCost) || 0,
        color: row.color || '#3498db',
        recurrence: row.recurrence || 'None',
        date: dateType === 'iso' ? {
          type: 'iso',
          value: {
            year: parseInt(row.year),
            isoWeek: parseInt(row.isoWeek),
            dayOffset: parseInt(row.dayOffset),
          },
        } : {
          type: 'normal',
          value: {
            year: parseInt(row.year),
            month: parseInt(row.month),
            day: parseInt(row.day),
          },
        },
      };

      const event = Event.fromObject(eventData);
      const isUpdate = events.has(event.id);
      events.set(event.id, event);

      if (isUpdate) {
        updateCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
    }
  }

  res.json({
    success: successCount,
    updated: updateCount,
    errors,
  });
});
