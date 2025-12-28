import React, { useState, useEffect } from 'react';
import { Event } from '../../common/Event.js';
import { doesEventOccurOnNormalDate } from '../../common/EventRecurrence.js';
import { EventDetailModal } from './EventDetailModal.js';
import * as eventApi from '../services/eventApi.js';

/**
 * Normal Calendar component - displays traditional calendar view
 */
export const NormalCalendar: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const quarterNames = ['Winter', 'Spring', 'Summer', 'Fall'];

  /**
   * Gets the quarter name for a given month (0-11)
   */
  const getQuarterName = (month: number): string => {
    const quarterIndex = Math.floor(month / 3);
    return quarterNames[quarterIndex];
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
   * Checks if a date is in the current ISO week
   */
  const isInCurrentISOWeek = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    const currentISOWeek = getISOWeek(today);
    const currentYear = today.getFullYear();

    const dateToCheck = new Date(year, month - 1, day);
    const dateISOWeek = getISOWeek(dateToCheck);
    const dateYear = dateToCheck.getFullYear();

    return dateYear === currentYear && dateISOWeek === currentISOWeek;
  };

  /**
   * Fetches events from the API
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventApi.fetchEvents();
        const eventObjects = data.map((e: any) => Event.fromObject(e));
        setEvents(eventObjects);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  /**
   * Gets events for a specific normal date (includes both ISO and Normal date events)
   */
  const getEventsForDate = (year: number, month: number, day: number): Event[] => {
    return events.filter(event => doesEventOccurOnNormalDate(event, year, month, day));
  };

  /**
   * Navigates to the previous month
   */
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /**
   * Navigates to the next month
   */
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * Renders the calendar days for the current month
   */
  const renderDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weeks: JSX.Element[] = [];
    let days: JSX.Element[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="calendar-day empty"></td>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(currentYear, currentMonth + 1, day);
      const isCurrentISOWeekDay = isInCurrentISOWeek(currentYear, currentMonth + 1, day);

      days.push(
        <td key={day} className={`calendar-day${isCurrentISOWeekDay ? ' iso-week-highlight' : ''}`}>
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="event-item"
                style={{ borderLeftColor: event.color }}
                onClick={() => setSelectedEvent(event)}
              >
                {event.title}
              </div>
            ))}
          </div>
        </td>
      );

      // Start a new week if we've filled 7 days
      if ((firstDay + day) % 7 === 0) {
        weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
        days = [];
      }
    }

    // Add the final week if there are remaining days
    if (days.length > 0) {
      // Fill remaining cells in the last week
      while (days.length < 7) {
        days.push(
          <td key={`empty-end-${days.length}`} className="calendar-day empty"></td>
        );
      }
      weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
    }

    return weeks;
  };

  return (
    <div className="normal-calendar">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={previousMonth}>&lt;</button>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <h2>
          {monthNames[currentMonth]} {currentYear} <span className="quarter-label">({getQuarterName(currentMonth)})</span>
        </h2>
        <div className="calendar-spacer"></div>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            {dayNames.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderDays()}</tbody>
      </table>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
