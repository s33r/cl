import { Event } from './Event.js';
import { RecurrencePattern } from './RecurrencePattern.js';

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
