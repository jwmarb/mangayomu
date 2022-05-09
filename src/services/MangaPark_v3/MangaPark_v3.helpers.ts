import { sub } from 'date-fns';

/**
 * Parse a string to only show digits
 * @param str The string to show only numbers
 * @returns Returns the string with numbers only
 */
export function digitsOnly(str: string) {
  return str.replace(/[^0-9\.]/g, '');
}

/**
 * Parse timestamp (e.g. 100 days ago) into a date string object
 * @param txt The text to parse into a date
 * @returns Returns a date string object
 */
export function parseTimestamp(txt: string) {
  const time = parseInt(txt.replace(/\D/g, ''));
  if (txt.indexOf('days') !== -1 || txt.indexOf('day') !== -1) {
    return sub(Date.now(), {
      days: time,
    }).toString();
  }
  if (txt.indexOf('hours') !== -1 || txt.indexOf('hour') !== -1) {
    return sub(Date.now(), {
      hours: time,
    }).toString();
  }

  if (txt.indexOf('mins') !== -1 || txt.indexOf('min') !== -1) {
    return sub(Date.now(), {
      minutes: time,
    }).toString();
  }

  if (txt.indexOf('secs') !== -1 || txt.indexOf('sec') !== -1) {
    return sub(Date.now(), {
      seconds: time,
    }).toString();
  }

  throw Error('Invalid date parsed: ' + txt);
}
