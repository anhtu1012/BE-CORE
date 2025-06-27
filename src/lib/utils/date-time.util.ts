export class DateTimeUtils {
  // Add hours to a given Date object
  static addHours(date: Date, hours: number): Date {
    return this.add(date, hours, 3600000); // 3600000 milliseconds = 1 hour
  }

  // Add a specified value scaled by a multiplier to a Date object
  private static add(date: Date, value: number, scale: number): Date {
    const num = Math.round(value * scale); // Scaled value in milliseconds
    const maxDate = new Date(8640000000000000); // Max JS date: 100,000,000 days
    const minDate = new Date(-8640000000000000); // Min JS date: -100,000,000 days

    const result = new Date(date.getTime() + num);
    if (result > maxDate || result < minDate) {
      throw new RangeError(
        'Date arithmetic operation resulted in an out-of-range date.',
      );
    }

    return result;
  }

  static convertToDateOnly(dateString: string): string {
    const date = new Date(dateString); // Tự động parse UTC
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static formatDateToYMDHMS(isoString: string, isDelay = true): string {
    const fixedDate =
      isDelay === true
        ? new Date(isoString).getTime() + 7 * 60 * 60 * 1000
        : isoString;
    const date = new Date(fixedDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
