import React, { useState, useEffect } from 'react';
import { RecurrencePattern, RECURRENCE_PATTERNS } from '../../common/RecurrencePattern.js';
import { EventType } from '../../common/Event.js';

/**
 * Event form props
 */
type EventFormProps = {
  onClose: () => void;
  onEventCreated?: () => void;
  editingEvent?: EventType | null;
};

/**
 * Event form component - for creating and editing events
 */
export const EventForm: React.FC<EventFormProps> = ({ onClose, onEventCreated, editingEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [financialCost, setFinancialCost] = useState('0');
  const [color, setColor] = useState('#3498db');
  const [recurrence, setRecurrence] = useState<RecurrencePattern>('None');
  const [dateType, setDateType] = useState<'iso' | 'normal'>('iso');

  // ISO Date fields
  const [isoYear, setIsoYear] = useState(new Date().getFullYear());
  const [isoWeek, setIsoWeek] = useState(1);
  const [dayOffset, setDayOffset] = useState(0);

  // Normal Date fields
  const [normalYear, setNormalYear] = useState(new Date().getFullYear());
  const [normalMonth, setNormalMonth] = useState(1);
  const [normalDay, setNormalDay] = useState(1);

  /**
   * Populate form when editing an event
   */
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setFinancialCost(editingEvent.financialCost.toString());
      setColor(editingEvent.color);
      setRecurrence(editingEvent.recurrence);

      if (editingEvent.date.type === 'iso') {
        setDateType('iso');
        setIsoYear(editingEvent.date.value.year);
        setIsoWeek(editingEvent.date.value.isoWeek);
        setDayOffset(editingEvent.date.value.dayOffset);
      } else {
        setDateType('normal');
        setNormalYear(editingEvent.date.value.year);
        setNormalMonth(editingEvent.date.value.month);
        setNormalDay(editingEvent.date.value.day);
      }
    }
  }, [editingEvent]);

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      financialCost: parseFloat(financialCost),
      color,
      recurrence,
      date:
        dateType === 'iso'
          ? {
              type: 'iso' as const,
              value: { year: isoYear, isoWeek, dayOffset },
            }
          : {
              type: 'normal' as const,
              value: { year: normalYear, month: normalMonth, day: normalDay },
            },
    };

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEvent ? { ...eventData, id: editingEvent.id } : eventData),
      });

      if (!response.ok) {
        throw new Error(editingEvent ? 'Failed to update event' : 'Failed to create event');
      }

      if (onEventCreated) {
        onEventCreated();
      } else {
        onClose();
      }
    } catch (error) {
      alert(
        (editingEvent ? 'Failed to update event: ' : 'Failed to create event: ') +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="financialCost">Financial Cost</label>
            <input
              type="number"
              id="financialCost"
              value={financialCost}
              onChange={(e) => setFinancialCost(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="recurrence">Recurrence</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrencePattern)}
            >
              {RECURRENCE_PATTERNS.map((pattern) => (
                <option key={pattern} value={pattern}>
                  {pattern.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="iso"
                  checked={dateType === 'iso'}
                  onChange={() => setDateType('iso')}
                />
                ISO Date
              </label>
              <label>
                <input
                  type="radio"
                  value="normal"
                  checked={dateType === 'normal'}
                  onChange={() => setDateType('normal')}
                />
                Normal Date
              </label>
            </div>
          </div>

          {dateType === 'iso' ? (
            <>
              <div className="form-group">
                <label htmlFor="isoYear">Year</label>
                <input
                  type="number"
                  id="isoYear"
                  value={isoYear}
                  onChange={(e) => setIsoYear(parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="isoWeek">ISO Week</label>
                <input
                  type="number"
                  id="isoWeek"
                  value={isoWeek}
                  onChange={(e) => setIsoWeek(parseInt(e.target.value))}
                  min="1"
                  max="53"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dayOffset">Day of Week</label>
                <select
                  id="dayOffset"
                  value={dayOffset}
                  onChange={(e) => setDayOffset(parseInt(e.target.value))}
                  required
                >
                  <option value="0">Monday</option>
                  <option value="1">Tuesday</option>
                  <option value="2">Wednesday</option>
                  <option value="3">Thursday</option>
                  <option value="4">Friday</option>
                  <option value="5">Saturday</option>
                  <option value="6">Sunday</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="normalYear">Year</label>
                <input
                  type="number"
                  id="normalYear"
                  value={normalYear}
                  onChange={(e) => setNormalYear(parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="normalMonth">Month</label>
                <input
                  type="number"
                  id="normalMonth"
                  value={normalMonth}
                  onChange={(e) => setNormalMonth(parseInt(e.target.value))}
                  min="1"
                  max="12"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="normalDay">Day</label>
                <input
                  type="number"
                  id="normalDay"
                  value={normalDay}
                  onChange={(e) => setNormalDay(parseInt(e.target.value))}
                  min="1"
                  max="31"
                  required
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{editingEvent ? 'Update Event' : 'Create Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
