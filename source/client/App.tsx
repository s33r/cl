import React, { useState } from 'react';
import { EventList } from './components/EventList.js';
import { ISOCalendar } from './components/ISOCalendar.js';
import { NormalCalendar } from './components/NormalCalendar.js';
import { EventForm } from './components/EventForm.js';
import { About } from './components/About.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.js';

/**
 * Main view type
 */
type View = 'events' | 'iso-calendar' | 'normal-calendar' | 'about';

/**
 * Main application component content
 */
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('iso-calendar');
  const [showEventForm, setShowEventForm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  /**
   * Renders the current view
   */
  const renderView = () => {
    switch (currentView) {
      case 'events':
        return <EventList />;
      case 'iso-calendar':
        return <ISOCalendar />;
      case 'normal-calendar':
        return <NormalCalendar />;
      case 'about':
        return <About />;
      default:
        return <ISOCalendar />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>ISO Calendar Events</h1>
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
        <EventForm onClose={() => setShowEventForm(false)} />
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
