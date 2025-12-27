import { z } from 'zod';

/**
 * Zod schema for ISO Date validation
 */
export const ISODateSchema = z.object({
  year: z.number().int().min(1),
  isoWeek: z.number().int().min(1).max(53),
  dayOffset: z.number().int().min(0).max(6),
});

/**
 * Type representing an ISO Date (Year, ISO Week Number, and Day Offset)
 */
export type ISODateType = z.infer<typeof ISODateSchema>;

/**
 * Immutable class representing an ISO Date
 */
export class ISODate {
  readonly year: number;
  readonly isoWeek: number;
  readonly dayOffset: number;

  /**
   * Creates a new ISODate instance
   * @param year - The year
   * @param isoWeek - The ISO week number (1-53)
   * @param dayOffset - The day offset within the week (0-6, where 0 is Monday)
   */
  constructor(year: number, isoWeek: number, dayOffset: number) {
    const validated = ISODateSchema.parse({ year, isoWeek, dayOffset });
    this.year = validated.year;
    this.isoWeek = validated.isoWeek;
    this.dayOffset = validated.dayOffset;
  }

  /**
   * Creates an ISODate from a plain object
   * @param obj - Object containing year, isoWeek, and dayOffset
   * @returns A new ISODate instance
   */
  static fromObject(obj: ISODateType): ISODate {
    return new ISODate(obj.year, obj.isoWeek, obj.dayOffset);
  }

  /**
   * Converts the ISODate to a plain object
   * @returns Plain object representation
   */
  toObject(): ISODateType {
    return {
      year: this.year,
      isoWeek: this.isoWeek,
      dayOffset: this.dayOffset,
    };
  }

  /**
   * Converts the ISODate to a string representation
   * @returns String in format "YYYY-W##-D"
   */
  toString(): string {
    return `${this.year}-W${String(this.isoWeek).padStart(2, '0')}-${this.dayOffset}`;
  }

  /**
   * Checks if this ISODate equals another
   * @param other - Another ISODate to compare
   * @returns True if equal, false otherwise
   */
  equals(other: ISODate): boolean {
    return (
      this.year === other.year &&
      this.isoWeek === other.isoWeek &&
      this.dayOffset === other.dayOffset
    );
  }
}
