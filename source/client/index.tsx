import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import './styles/main.scss';
import { setEventApiAdapter } from './services/eventApi.js';
import { httpAdapter } from './services/httpAdapter.js';
import { localStorageAdapter } from './services/localStorageAdapter.js';

/**
 * Check if demo mode is enabled
 * Demo mode can be enabled by:
 * 1. URL parameter: ?demo=true
 * 2. localStorage flag: localStorage.setItem('demoMode', 'true')
 */
const isDemoMode = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlDemo = urlParams.get('demo');
  const storageDemo = localStorage.getItem('demoMode');

  return urlDemo === 'true' || storageDemo === 'true';
};

/**
 * Initialize the API adapter based on demo mode
 */
const initializeApiAdapter = (): void => {
  if (isDemoMode()) {
    console.log('Running in DEMO mode - using localStorage');
    setEventApiAdapter(localStorageAdapter);
  } else {
    console.log('Running in SERVER mode - using HTTP API');
    setEventApiAdapter(httpAdapter);
  }
};

// Initialize API adapter before rendering
initializeApiAdapter();

/**
 * Client application entry point
 */
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
