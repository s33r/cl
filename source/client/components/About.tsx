import React from 'react';

/**
 * About component - displays information about the application
 */
export const About: React.FC = () => {
  return (
    <div className="about">
      <h2>About ISO Calendar Events</h2>

      <section>
        <h3>What is this application?</h3>
        <p>
          ISO Calendar Events is a web application for tracking events on a calendar
          based on ISO Week Numbers. It provides a unique way to organize and view
          your events using the ISO 8601 week date system.
        </p>
      </section>

      <section>
        <h3>ISO Calendar System</h3>
        <p>The ISO Calendar in this application is structured as follows:</p>
        <ul>
          <li>Each Year has 4 Quarters</li>
          <li>Each Quarter has 3 Months and 1 extra Week</li>
          <li>Each Month has 4 Weeks</li>
          <li>Each Week has 7 Days</li>
          <li>Leap weeks are appended to the 4th Quarter</li>
        </ul>
        <p>
          The calendar starts with the first ISO Week number of the year and runs
          through the end of the year, including leap weeks as needed.
        </p>
      </section>

      <section>
        <h3>Features</h3>
        <ul>
          <li>Create, edit, and delete events</li>
          <li>View events in ISO Calendar format</li>
          <li>View events in traditional calendar format</li>
          <li>Set recurring events with multiple patterns</li>
          <li>Track financial costs associated with events</li>
          <li>Color-code events for easy identification</li>
          <li>Toggle between dark and light mode</li>
        </ul>
      </section>

      <section>
        <h3>Event Types</h3>
        <p>Events can be created with two types of dates:</p>
        <ul>
          <li>
            <strong>ISO Date:</strong> Based on Year, ISO Week Number, and Day Offset.
            The week number and day offset are preserved in recurring events.
          </li>
          <li>
            <strong>Normal Date:</strong> Based on Year, Month, and Day, following
            the traditional calendar system.
          </li>
        </ul>
      </section>

      <section>
        <h3>Recurrence Patterns</h3>
        <p>Events support the following recurrence patterns:</p>
        <ul>
          <li>None (one-time event)</li>
          <li>Every Day</li>
          <li>Every Week</li>
          <li>Every Month</li>
          <li>Every Quarter</li>
          <li>Every Year</li>
          <li>Every 2 Years</li>
          <li>Every 3 Years</li>
          <li>Every 5 Years</li>
          <li>Every 10 Years</li>
        </ul>
      </section>
    </div>
  );
};
