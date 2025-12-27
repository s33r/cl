# Project Overview

This project is a web application that is tracks events on a calendar based on ISO Week Numbers.

## Project Description

There are two key elements to this project:
1. The _ISOCalender_
2. Events

### ISOCalender
The ISOCalender starts with the first ISO Week number of the year and runs through the end of the year. It includes leap weeks as needed.

The ISOCalender breaks down like this:

Each _Year_ has 4 _Quarters_.
Each _Quarter_ has 3 _Months_ and 1 extra _Week_.
Each _Month_ has 4 _Weeks_.
Each _Week_ has 7 _Days_.
Leap weeks are appended to the 4th Quarter.

The months are named the same as on a normal calendar.
The quarters can also be named after the seasons (Winter, Spring, Fall, Summer)

The ISOCalender is displayed much like a normal calender except that each row is a single week of 7 days.
Each page of the ISOCalender shows 1 month.
Each extra week is appended to the last month of the quarter.

### Events

#### Event Timing
Each event has either an ISODate which indicates the Year, ISO Week, and day offset that it occurs on or a NormalDate which indicates the Year, Month, and day that it occurs on.

#### Event Reoccurrence
Events can happen a single time or they may reoccur. The actual pattern for the reoccurrence will depend on if the date is a ISODate or NormalDate.

The following reoccurrence patterns supported:
1. None
2. Every Day
3. Every Week
4. Every Month
5. Every Quarter
6. Every Year
7. Every 2 Years
8. Every 3 Years
9. Every 5 Years
10. Every 10 Years

If the event is an ISODate then the week number and day offset are preserved wherever possible.

#### Other Fields

Events also have four data fields:
1. Title
2. Description
3. Financial Cost
4. Color

### User Features
- Create Events
- Edit Events
- Delete Events
- View Event list
- View ISOCalendar
- View NormalCalendar
- Toggle between dark and light mode
- View information about the app.

## Project Structure

The project follows a modular structure.

The source code is kept in the source directory: `source`.

The source directory has three directories under it:
- `client`: for client side code. It has an index.ts file which is the entrypoint to the client app.
- `server`: for server side code. It has an index.ts file which is the entrypoint to the server app.
- `common`: for code that is shared between both client and server.

The output code is placed in the `dist` directory.
The `dist` directory has three directories under it:
1. `client`: for client side code.
2. `server`: for server side code.
3. `common`: for code that is shared between both client and server.



## Technologies Used

- NodeJS: Backend API as well as Building and automation
- TypeScript: Client and Server code
- esbuild: compiling
- sass: stylesheets
- react: presentation layer
- zod: data type validation
- express.js: backend API


## Development Guidelines

### Code Style

Code should be written according to "clean code" principles.

Data should be kept in immutable, classes. Operations that transform that data should be defined as functions on the classes.

When functions are defined outside of classes, they should be written using arrow syntax.

Do not use TypeScript interfaces, instead use types.


### Documentation

- All typeScript functions should have meaningful jsdoc that includes information about all parameters and return values.
- All classes should have meaningful jsdoc that describes their purpose and intent.
- All public class properties should have meaningful jsdoc that describes their purpose and intent.

## Important Context



## Common Tasks

build: run esbuild to compile the source code
serve: run esbuild watch and a local web server to test the app.

## Notes for Claude

- When committing code, ensure that the commit message is pithy expresses the intent of the changes. There is no need for detail since it is already captured in the file changes.
- When working on todo tasks only do one at a time.
