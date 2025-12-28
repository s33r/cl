import React, { useState } from 'react';
import { EventList } from './components/EventList.js';
import { ISOCalendar } from './components/ISOCalendar.js';
import { NormalCalendar } from './components/NormalCalendar.js';
import { EventForm } from './components/EventForm.js';
import { About } from './components/About.js';
import { CSVImport } from './components/CSVImport.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.js';
import { EventType } from './common/Event.js';

/**
 * Main view type
 */
type View = 'events' | 'iso-calendar' | 'normal-calendar' | 'csv-import' | 'about';

/**
 * Main application component content
 */
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('iso-calendar');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { theme, toggleTheme } = useTheme();

  /**
   * Triggers a refresh of the event list
   */
  const handleEventCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowEventForm(false);
    setEditingEvent(null);
  };

  /**
   * Handles editing an event
   */
  const handleEditEvent = (event: EventType) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  /**
   * Closes the event form
   */
  const handleCloseForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  /**
   * Renders the current view
   */
  const renderView = () => {
    switch (currentView) {
      case 'events':
        return <EventList refreshTrigger={refreshTrigger} onEditEvent={handleEditEvent} />;
      case 'iso-calendar':
        return <ISOCalendar />;
      case 'normal-calendar':
        return <NormalCalendar />;
      case 'csv-import':
        return <CSVImport onImportComplete={handleEventCreated} />;
      case 'about':
        return <About />;
      default:
        return <ISOCalendar />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="header-top">
          <h1>ISO Calendar Events</h1>
          <a href="/vibe-coding.html" className="home-link">
            Home
          </a>
        </div>
        <nav className="app-nav">
          <button
            className={currentView === 'iso-calendar' ? 'active' : ''}
            onClick={() => setCurrentView('iso-calendar')}
          >
            ISO Calendar
          </button>
          <button
            className={currentView === 'normal-calendar' ? 'active' : ''}
            onClick={() => setCurrentView('normal-calendar')}
          >
            Normal Calendar
          </button>
          <button
            className={currentView === 'events' ? 'active' : ''}
            onClick={() => setCurrentView('events')}
          >
            Events
          </button>
          <button
            className={currentView === 'csv-import' ? 'active' : ''}
            onClick={() => setCurrentView('csv-import')}
          >
            Import CSV
          </button>
          <button
            className={currentView === 'about' ? 'active' : ''}
            onClick={() => setCurrentView('about')}
          >
            About
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>

      <main className="app-main">
        {renderView()}
      </main>

      <button
        className="fab"
        onClick={() => setShowEventForm(true)}
        title="Create Event"
      >
        +
      </button>

      {showEventForm && (
        <EventForm
          onClose={handleCloseForm}
          onEventCreated={handleEventCreated}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
};

/**
 * Main application component with theme provider
 */
export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};
