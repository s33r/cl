import React, { useState, useEffect } from 'react';
import { Event } from '../../common/Event.js';
import { doesEventOccurOnISODate } from '../../common/EventRecurrence.js';
import { EventDetailModal } from './EventDetailModal.js';

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
 * Checks if a given year has a leap week (week 53)
 * A year has 53 weeks when it starts on Thursday or ends on Thursday
 */
const hasLeapWeek = (year: number): boolean => {
  // Check if Dec 31 of the given year is in ISO week 53
  const dec31 = new Date(year, 11, 31);
  const isoWeek = getISOWeek(dec31);
  return isoWeek === 53;
};

/**
 * Calculates the ISO calendar month (1-12) that contains a given ISO week
 */
const getISOMonthFromWeek = (isoWeek: number): number => {
  // Each quarter has 13 weeks (3 months of 4 weeks + 1 extra week)
  // Quarter 1: weeks 1-13 (months 1-3)
  // Quarter 2: weeks 14-26 (months 4-6)
  // Quarter 3: weeks 27-39 (months 7-9)
  // Quarter 4: weeks 40-52/53 (months 10-12)

  if (isoWeek <= 13) {
    // Q1: weeks 1-13
    if (isoWeek <= 4) return 1;
    if (isoWeek <= 8) return 2;
    return 3;
  } else if (isoWeek <= 26) {
    // Q2: weeks 14-26
    if (isoWeek <= 17) return 4;
    if (isoWeek <= 21) return 5;
    return 6;
  } else if (isoWeek <= 39) {
    // Q3: weeks 27-39
    if (isoWeek <= 30) return 7;
    if (isoWeek <= 34) return 8;
    return 9;
  } else {
    // Q4: weeks 40-52/53
    if (isoWeek <= 43) return 10;
    if (isoWeek <= 47) return 11;
    return 12;
  }
};

/**
 * ISO Calendar component - displays calendar based on ISO week numbers
 */
export const ISOCalendar: React.FC = () => {
  const today = new Date();
  const currentISOWeek = getISOWeek(today);
  const initialMonth = getISOMonthFromWeek(currentISOWeek);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialMonth); // 1-12
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

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  /**
   * Fetches events from the API
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        const eventObjects = data.map((e: any) => Event.fromObject(e));
        setEvents(eventObjects);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  /**
   * Gets events for a specific ISO date (includes both ISO and Normal date events)
   */
  const getEventsForDate = (year: number, isoWeek: number, dayOffset: number): Event[] => {
    return events.filter(event => doesEventOccurOnISODate(event, year, isoWeek, dayOffset));
  };

  /**
   * Navigates to the previous month
   */
  const previousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /**
   * Navigates to the next month
   */
  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * Gets the date of the Monday in a given ISO week
   */
  const getDateOfISOWeek = (year: number, week: number): Date => {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const isoWeekStart = simple;
    if (dow <= 4) {
      isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    return isoWeekStart;
  };

  /**
   * Formats a date as MM-dd
   */
  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  /**
   * Renders the calendar weeks for the current month
   */
  const renderWeeks = () => {
    const weeks: JSX.Element[] = [];

    // Determine the number of weeks for this month
    // Regular months: 4 weeks
    // Last month of each quarter (3, 6, 9): 5 weeks (includes the extra week)
    // Month 12: 5 or 6 weeks (includes extra week + leap week if applicable)
    let weeksInMonth = 4;
    const isLastMonthOfQuarter = currentMonth % 3 === 0;

    if (isLastMonthOfQuarter) {
      weeksInMonth = 5; // Extra week for the quarter

      if (currentMonth === 12 && hasLeapWeek(currentYear)) {
        weeksInMonth = 6; // Extra week + leap week for December
      }
    }

    const quarterStartMonth = Math.floor((currentMonth - 1) / 3) * 3 + 1;
    const monthInQuarter = currentMonth - quarterStartMonth;
    const startWeek = (Math.floor((currentMonth - 1) / 3) * 13) + (monthInQuarter * 4) + 1;

    for (let weekNum = 0; weekNum < weeksInMonth; weekNum++) {
      const isoWeek = startWeek + weekNum;
      const days: JSX.Element[] = [];

      // Get the Monday of this ISO week
      const mondayDate = getDateOfISOWeek(currentYear, isoWeek);

      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        // Calculate the actual date for this day
        const date = new Date(mondayDate);
        date.setDate(mondayDate.getDate() + dayOffset);

        const dayEvents = getEventsForDate(currentYear, isoWeek, dayOffset);

        days.push(
          <td key={dayOffset} className="calendar-day">
            <div className="day-number">{formatDate(date)}</div>
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
      }

      const isCurrentWeek = isoWeek === currentISOWeek && currentYear === today.getFullYear();
      weeks.push(
        <tr key={isoWeek} className={`calendar-week${isCurrentWeek ? ' current-week' : ''}`}>
          <td className="week-number">W{isoWeek}</td>
          {days}
        </tr>
      );
    }

    return weeks;
  };

  return (
    <div className="iso-calendar">
      <div className="calendar-header">
        <button onClick={previousMonth}>&lt;</button>
        <h2>
          {monthNames[currentMonth - 1]} {currentYear}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            <th className="week-number-header">Week</th>
            {dayNames.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderWeeks()}</tbody>
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
