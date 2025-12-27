import React, { useState } from 'react';

/**
 * ISO Calendar component - displays calendar based on ISO week numbers
 */
export const ISOCalendar: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(1); // 1-12

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
   * Renders the calendar weeks for the current month
   */
  const renderWeeks = () => {
    const weeks: JSX.Element[] = [];

    // Calculate weeks for this month (4 weeks per month in ISO calendar)
    const weeksInMonth = 4;
    const quarterStartMonth = Math.floor((currentMonth - 1) / 3) * 3 + 1;
    const monthInQuarter = currentMonth - quarterStartMonth;
    const startWeek = (Math.floor((currentMonth - 1) / 3) * 13) + (monthInQuarter * 4) + 1;

    for (let weekNum = 0; weekNum < weeksInMonth; weekNum++) {
      const isoWeek = startWeek + weekNum;
      const days: JSX.Element[] = [];

      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        days.push(
          <td key={dayOffset} className="calendar-day">
            <div className="day-number">{dayOffset + 1}</div>
            <div className="day-events"></div>
          </td>
        );
      }

      weeks.push(
        <tr key={isoWeek} className="calendar-week">
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
    </div>
  );
};
