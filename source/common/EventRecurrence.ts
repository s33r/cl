import { Event } from './Event.js';
import { RecurrencePattern } from './RecurrencePattern.js';

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
 * Converts an ISO date (year, week, dayOffset) to a normal Date object
 */
const isoDateToNormalDate = (year: number, isoWeek: number, dayOffset: number): Date => {
  const monday = getDateOfISOWeek(year, isoWeek);
  const date = new Date(monday);
  date.setDate(monday.getDate() + dayOffset);
  return date;
};

/**
 * Calculates if an ISO date event should occur on a specific date
 * @param event - The event to check
 * @param year - Year to check
 * @param isoWeek - ISO week number to check
 * @param dayOffset - Day offset to check (0-6)
 * @returns True if the event occurs on this date
 */
export const doesISOEventOccurOnDate = (
  event: Event,
  year: number,
  isoWeek: number,
  dayOffset: number
): boolean => {
  if (event.date.type !== 'iso') {
    return false;
  }

  const eventDate = event.date.value;

  if (eventDate.isoWeek !== isoWeek || eventDate.dayOffset !== dayOffset) {
    return false;
  }

  const yearDiff = year - eventDate.year;

  switch (event.recurrence) {
    case 'None':
      return year === eventDate.year;
    case 'EveryYear':
      return yearDiff >= 0;
    case 'Every2Years':
      return yearDiff >= 0 && yearDiff % 2 === 0;
    case 'Every3Years':
      return yearDiff >= 0 && yearDiff % 3 === 0;
    case 'Every5Years':
      return yearDiff >= 0 && yearDiff % 5 === 0;
    case 'Every10Years':
      return yearDiff >= 0 && yearDiff % 10 === 0;
    default:
      return false;
  }
};

/**
 * Calculates if a normal date event should occur on a specific date
 * @param event - The event to check
 * @param year - Year to check
 * @param month - Month to check (1-12)
 * @param day - Day to check
 * @returns True if the event occurs on this date
 */
export const doesNormalEventOccurOnDate = (
  event: Event,
  year: number,
  month: number,
  day: number
): boolean => {
  if (event.date.type !== 'normal') {
    return false;
  }

  const eventDate = event.date.value;

  switch (event.recurrence) {
    case 'None':
      return (
        year === eventDate.year &&
        month === eventDate.month &&
        day === eventDate.day
      );

    case 'EveryDay':
      {
        const eventDateObj = new Date(eventDate.year, eventDate.month - 1, eventDate.day);
        const checkDate = new Date(year, month - 1, day);
        return checkDate >= eventDateObj;
      }

    case 'EveryWeek':
      {
        const eventDateObj = new Date(eventDate.year, eventDate.month - 1, eventDate.day);
        const checkDate = new Date(year, month - 1, day);
        if (checkDate < eventDateObj) return false;

        const daysDiff = Math.floor((checkDate.getTime() - eventDateObj.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff % 7 === 0;
      }

    case 'EveryMonth':
      if (day !== eventDate.day) return false;
      {
        const eventDateObj = new Date(eventDate.year, eventDate.month - 1, eventDate.day);
        const checkDate = new Date(year, month - 1, day);
        return checkDate >= eventDateObj;
      }

    case 'EveryQuarter':
      if (day !== eventDate.day) return false;
      {
        const eventQuarterStartMonth = Math.floor((eventDate.month - 1) / 3) * 3 + 1;
        const checkQuarterStartMonth = Math.floor((month - 1) / 3) * 3 + 1;
        if (month !== eventQuarterStartMonth + (eventDate.month - eventQuarterStartMonth)) return false;

        const eventDateObj = new Date(eventDate.year, eventDate.month - 1, eventDate.day);
        const checkDate = new Date(year, month - 1, day);
        return checkDate >= eventDateObj;
      }

    case 'EveryYear':
      if (month !== eventDate.month || day !== eventDate.day) return false;
      return year >= eventDate.year;

    case 'Every2Years':
      if (month !== eventDate.month || day !== eventDate.day) return false;
      {
        const yearDiff = year - eventDate.year;
        return yearDiff >= 0 && yearDiff % 2 === 0;
      }

    case 'Every3Years':
      if (month !== eventDate.month || day !== eventDate.day) return false;
      {
        const yearDiff = year - eventDate.year;
        return yearDiff >= 0 && yearDiff % 3 === 0;
      }

    case 'Every5Years':
      if (month !== eventDate.month || day !== eventDate.day) return false;
      {
        const yearDiff = year - eventDate.year;
        return yearDiff >= 0 && yearDiff % 5 === 0;
      }

    case 'Every10Years':
      if (month !== eventDate.month || day !== eventDate.day) return false;
      {
        const yearDiff = year - eventDate.year;
        return yearDiff >= 0 && yearDiff % 10 === 0;
      }

    default:
      return false;
  }
};

/**
 * Checks if any event (ISO or Normal date type) occurs on a specific normal calendar date
 * @param event - The event to check
 * @param year - Year to check
 * @param month - Month to check (1-12)
 * @param day - Day to check
 * @returns True if the event occurs on this date
 */
export const doesEventOccurOnNormalDate = (
  event: Event,
  year: number,
  month: number,
  day: number
): boolean => {
  if (event.date.type === 'normal') {
    return doesNormalEventOccurOnDate(event, year, month, day);
  }

  // For ISO date events, convert the ISO date to a normal date and check
  const eventDate = event.date.value;
  const targetDate = new Date(year, month - 1, day);
  const targetISOWeek = getISOWeek(targetDate);
  const targetDayOffset = (targetDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  // Check if this specific date matches the event's ISO date pattern
  return doesISOEventOccurOnDate(event, year, targetISOWeek, targetDayOffset);
};

/**
 * Checks if any event (ISO or Normal date type) occurs on a specific ISO calendar date
 * @param event - The event to check
 * @param year - Year to check
 * @param isoWeek - ISO week number to check
 * @param dayOffset - Day offset to check (0-6)
 * @returns True if the event occurs on this date
 */
export const doesEventOccurOnISODate = (
  event: Event,
  year: number,
  isoWeek: number,
  dayOffset: number
): boolean => {
  if (event.date.type === 'iso') {
    return doesISOEventOccurOnDate(event, year, isoWeek, dayOffset);
  }

  // For normal date events, convert the ISO date to a normal date and check
  const normalDate = isoDateToNormalDate(year, isoWeek, dayOffset);
  const normalYear = normalDate.getFullYear();
  const normalMonth = normalDate.getMonth() + 1;
  const normalDay = normalDate.getDate();

  return doesNormalEventOccurOnDate(event, normalYear, normalMonth, normalDay);
};
