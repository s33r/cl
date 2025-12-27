import { z } from 'zod';

/**
 * Zod schema for Normal Date validation
 */
export const NormalDateSchema = z.object({
  year: z.number().int().min(1),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

/**
 * Type representing a Normal Date (Year, Month, Day)
 */
export type NormalDateType = z.infer<typeof NormalDateSchema>;

/**
 * Immutable class representing a Normal Calendar Date
 */
export class NormalDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  /**
   * Creates a new NormalDate instance
   * @param year - The year
   * @param month - The month (1-12)
   * @param day - The day of the month (1-31)
   */
  constructor(year: number, month: number, day: number) {
    const validated = NormalDateSchema.parse({ year, month, day });
    this.year = validated.year;
    this.month = validated.month;
    this.day = validated.day;
  }

  /**
   * Creates a NormalDate from a plain object
   * @param obj - Object containing year, month, and day
   * @returns A new NormalDate instance
   */
  static fromObject(obj: NormalDateType): NormalDate {
    return new NormalDate(obj.year, obj.month, obj.day);
  }

  /**
   * Converts the NormalDate to a plain object
   * @returns Plain object representation
   */
  toObject(): NormalDateType {
    return {
      year: this.year,
      month: this.month,
      day: this.day,
    };
  }

  /**
   * Converts the NormalDate to a string representation
   * @returns String in format "YYYY-MM-DD"
   */
  toString(): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
  }

  /**
   * Checks if this NormalDate equals another
   * @param other - Another NormalDate to compare
   * @returns True if equal, false otherwise
   */
  equals(other: NormalDate): boolean {
    return (
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day
    );
  }
}
