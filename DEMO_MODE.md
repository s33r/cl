# Demo Mode

The application now supports a demo mode that runs entirely in the browser without requiring a backend server. All events are stored in localStorage.

## How to Enable Demo Mode

There are three ways to enable demo mode:

### 1. URL Parameter (Recommended for Testing)

Add `?demo=true` to the URL:

```
http://localhost:3000/?demo=true
```

### 2. localStorage Flag (Persistent)

Open the browser console and run:

```javascript
localStorage.setItem('demoMode', 'true');
```

Then refresh the page. This will persist across page reloads.

To disable demo mode:

```javascript
localStorage.removeItem('demoMode');
```

### 3. Demo HTML File

Open `demo.html` in your browser using a local file server. This file automatically enables demo mode.

## Features in Demo Mode

All features work exactly the same as with the server:

- ✅ Create events
- ✅ Edit events
- ✅ Delete events
- ✅ Delete all events
- ✅ View events in the list
- ✅ Import events from CSV
- ✅ Dark/light mode toggle
- ✅ ISO and Normal calendar views

## Data Storage

In demo mode, all event data is stored in the browser's localStorage under the key `iso-calendar-events`. This means:

- Data persists across page reloads
- Data is stored locally on your device only
- Clearing browser data will delete all events
- Each browser has its own separate data

## Checking Current Mode

When the app loads, check the browser console. You'll see one of these messages:

- `Running in DEMO mode - using localStorage`
- `Running in SERVER mode - using HTTP API`

## Use Cases

Demo mode is perfect for:

- Testing the application without setting up a server
- Offline usage
- Demonstrations and presentations
- Development and debugging
- Sharing the app as a static site

## Limitations

- CSV import works, but files are parsed in the browser
- No server-side validation (validation still happens client-side via Zod)
- Data is not shared across devices or browsers
- Limited by localStorage size limits (typically 5-10MB)
