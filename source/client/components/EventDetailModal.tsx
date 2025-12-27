import React from 'react';
import { Event } from '../../common/Event.js';

type EventDetailModalProps = {
  event: Event;
  onClose: () => void;
};

/**
 * Modal component for displaying read-only event details
 */
export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const formatDate = (): string => {
    if (event.date.type === 'iso') {
      const { year, isoWeek, dayOffset } = event.date.value;
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return `${year}, Week ${isoWeek}, ${dayNames[dayOffset]}`;
    } else {
      const { year, month, day } = event.date.value;
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[month - 1]} ${day}, ${year}`;
    }
  };

  const formatRecurrence = (recurrence: string): string => {
    switch (recurrence) {
      case 'None':
        return 'Does not repeat';
      case 'EveryDay':
        return 'Every day';
      case 'EveryWeek':
        return 'Every week';
      case 'EveryMonth':
        return 'Every month';
      case 'EveryQuarter':
        return 'Every quarter';
      case 'EveryYear':
        return 'Every year';
      case 'Every2Years':
        return 'Every 2 years';
      case 'Every3Years':
        return 'Every 3 years';
      case 'Every5Years':
        return 'Every 5 years';
      case 'Every10Years':
        return 'Every 10 years';
      default:
        return recurrence;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{event.title}</h2>
        <div className="event-detail-content">
          <div className="detail-group">
            <strong>Description:</strong>
            <p>{event.description || 'No description provided'}</p>
          </div>

          <div className="detail-group">
            <strong>Date:</strong>
            <p>{formatDate()}</p>
          </div>

          <div className="detail-group">
            <strong>Recurrence:</strong>
            <p>{formatRecurrence(event.recurrence)}</p>
          </div>

          <div className="detail-group">
            <strong>Financial Cost:</strong>
            <p>${event.financialCost.toFixed(2)}</p>
          </div>

          <div className="detail-group">
            <strong>Color:</strong>
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: event.color,
                border: '2px solid #333',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
