import React, { useState } from 'react';

/**
 * Normal Calendar component - displays traditional calendar view
 */
export const NormalCalendar: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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
      days.push(
        <td key={day} className="calendar-day">
          <div className="day-number">{day}</div>
          <div className="day-events"></div>
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
        <button onClick={previousMonth}>&lt;</button>
        <h2>
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
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
    </div>
  );
};
