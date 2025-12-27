/**
 * Enum representing the different recurrence patterns for events
 */
export type RecurrencePattern =
  | 'None'
  | 'EveryDay'
  | 'EveryWeek'
  | 'EveryMonth'
  | 'EveryQuarter'
  | 'EveryYear'
  | 'Every2Years'
  | 'Every3Years'
  | 'Every5Years'
  | 'Every10Years';

/**
 * All possible recurrence patterns
 */
export const RECURRENCE_PATTERNS: RecurrencePattern[] = [
  'None',
  'EveryDay',
  'EveryWeek',
  'EveryMonth',
  'EveryQuarter',
  'EveryYear',
  'Every2Years',
  'Every3Years',
  'Every5Years',
  'Every10Years',
];
