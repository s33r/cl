import { z } from 'zod';
import { ISODate, ISODateSchema } from './ISODate.js';
import { NormalDate, NormalDateSchema } from './NormalDate.js';
import { RecurrencePattern } from './RecurrencePattern.js';

/**
 * Zod schema for Event validation
 */
export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  financialCost: z.number().min(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  recurrence: z.enum([
    'None',
    'EveryDay',
    'EveryWeek',
    'EveryMonth',
    'EveryQuarter',
    'EveryYear',
    'Every2Years',
    'Every3Years',
    'Every5Years',
    'Every10Years',
  ]),
  date: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('iso'),
      value: ISODateSchema,
    }),
    z.object({
      type: z.literal('normal'),
      value: NormalDateSchema,
    }),
  ]),
});

/**
 * Type representing an Event's date (either ISO or Normal)
 */
export type EventDate =
  | { type: 'iso'; value: ISODate }
  | { type: 'normal'; value: NormalDate };

/**
 * Type for Event data
 */
export type EventType = z.infer<typeof EventSchema>;

/**
 * Immutable class representing a calendar Event
 */
export class Event {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly financialCost: number;
  readonly color: string;
  readonly recurrence: RecurrencePattern;
  readonly date: EventDate;

  /**
   * Creates a new Event instance
   * @param id - Unique identifier for the event
   * @param title - Event title
   * @param description - Event description
   * @param financialCost - Financial cost associated with the event
   * @param color - Hex color code for the event
   * @param recurrence - Recurrence pattern
   * @param date - Event date (ISO or Normal)
   */
  constructor(
    id: string,
    title: string,
    description: string,
    financialCost: number,
    color: string,
    recurrence: RecurrencePattern,
    date: EventDate
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.financialCost = financialCost;
    this.color = color;
    this.recurrence = recurrence;
    this.date = date;
  }

  /**
   * Creates an Event from a plain object
   * @param obj - Object containing event data
   * @returns A new Event instance
   */
  static fromObject(obj: any): Event {
    const validated = EventSchema.parse(obj);

    let date: EventDate;
    if (validated.date.type === 'iso') {
      date = {
        type: 'iso',
        value: ISODate.fromObject(validated.date.value),
      };
    } else {
      date = {
        type: 'normal',
        value: NormalDate.fromObject(validated.date.value),
      };
    }

    return new Event(
      validated.id,
      validated.title,
      validated.description,
      validated.financialCost,
      validated.color,
      validated.recurrence,
      date
    );
  }

  /**
   * Converts the Event to a plain object
   * @returns Plain object representation
   */
  toObject(): EventType {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      financialCost: this.financialCost,
      color: this.color,
      recurrence: this.recurrence,
      date:
        this.date.type === 'iso'
          ? { type: 'iso', value: this.date.value.toObject() }
          : { type: 'normal', value: this.date.value.toObject() },
    };
  }

  /**
   * Creates a new Event with updated fields
   * @param updates - Partial updates to apply
   * @returns A new Event instance with the updates applied
   */
  withUpdates(updates: Partial<Omit<EventType, 'id'>>): Event {
    return new Event(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.financialCost ?? this.financialCost,
      updates.color ?? this.color,
      updates.recurrence ?? this.recurrence,
      updates.date ?? this.date
    );
  }
}
