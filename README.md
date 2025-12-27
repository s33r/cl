# ISO Calendar Events

A web application for tracking events on a calendar based on ISO Week Numbers.

## Overview

ISO Calendar Events provides a unique way to organize and view your events using the ISO 8601 week date system. The application supports both ISO week-based dates and traditional calendar dates, with various recurrence patterns and event tracking features.

## Features

- **Dual Calendar Views**: View events in both ISO Calendar and traditional calendar formats
- **Event Management**: Create, edit, and delete events with ease
- **Flexible Date Types**:
  - ISO Dates (Year, ISO Week, Day Offset)
  - Normal Dates (Year, Month, Day)
- **Recurrence Patterns**: Support for multiple recurrence options including daily, weekly, monthly, quarterly, and various yearly patterns
- **Financial Tracking**: Associate financial costs with events
- **Color Coding**: Organize events visually with custom colors
- **Dark Mode**: Toggle between light and dark themes
- **Event List View**: See all your events in a comprehensive list

## ISO Calendar Structure

- Each Year has 4 Quarters
- Each Quarter has 3 Months and 1 extra Week
- Each Month has 4 Weeks
- Each Week has 7 Days
- Leap weeks are appended to the 4th Quarter

## Tech Stack

- **Frontend**: React, TypeScript, SASS
- **Backend**: Node.js, Express.js
- **Build Tool**: esbuild
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

### Development

To run the development server with hot reloading:

```bash
npm run serve
```

The application will be available at `http://localhost:3000`

### Building for Production

To build the project:

```bash
npm run build
```

This will compile all TypeScript files and bundle the client application into the `dist` directory.

### Running in Production

After building, start the production server:

```bash
npm start
```

## Project Structure

```
cl/
├── source/
│   ├── client/          # React client application
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   ├── styles/      # SASS stylesheets
│   │   ├── App.tsx      # Main app component
│   │   └── index.tsx    # Client entry point
│   ├── server/          # Express server
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Server entry point
│   └── common/          # Shared code (data models)
│       ├── Event.ts
│       ├── ISODate.ts
│       ├── NormalDate.ts
│       └── RecurrencePattern.ts
├── dist/                # Build output
├── index.html           # HTML entry point
├── build.mjs            # Build configuration
├── serve.mjs            # Development server
└── package.json
```

## Available Scripts

- `npm run build` - Compile TypeScript and bundle the application
- `npm run serve` - Start development server with hot reloading
- `npm start` - Run the production server

## API Endpoints

- `GET /api/events` - Retrieve all events
- `GET /api/events/:id` - Retrieve a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an existing event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/health` - Health check endpoint

## Contributing

When contributing to this project, please follow the clean code principles outlined in CLAUDE.MD.

## License

ISC
