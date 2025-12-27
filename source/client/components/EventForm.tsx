import React, { useState } from 'react';
import { RecurrencePattern, RECURRENCE_PATTERNS } from '../../common/RecurrencePattern.js';

/**
 * Event form props
 */
type EventFormProps = {
  onClose: () => void;
};

/**
 * Event form component - for creating and editing events
 */
export const EventForm: React.FC<EventFormProps> = ({ onClose }) => {
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
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      onClose();
    } catch (error) {
      alert('Failed to create event: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Event</h2>
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
                <label htmlFor="dayOffset">Day Offset (0=Mon, 6=Sun)</label>
                <input
                  type="number"
                  id="dayOffset"
                  value={dayOffset}
                  onChange={(e) => setDayOffset(parseInt(e.target.value))}
                  min="0"
                  max="6"
                  required
                />
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
            <button type="submit">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};
