import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToTitleCase(str: string) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(inputDate: string): string {
  const date = new Date(inputDate);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function convertUTCtoIST(utcDate: string): string {
  const date = new Date(utcDate);

  // IST is UTC+5:30
  const offsetIST = 5 * 60 + 30;
  const istDate = new Date(date.getTime() + offsetIST * 60 * 1000);

  return istDate.toISOString();
}

export function convertUTCToISTWithAMPM(utcTimeString: string) {
  // Split the input time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = utcTimeString.split(':').map(Number);

  // Create a Date object in UTC for the given time
  const utcDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));

  // IST Offset: 5 hours and 30 minutes
  const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // in milliseconds

  // Create a new Date object for IST
  const istDate = new Date(utcDate.getTime() + istOffset);

  // Extract hours and minutes
  let istHours = istDate.getUTCHours();
  const istMinutes = istDate.getUTCMinutes();

  // Determine AM/PM
  const ampm = istHours >= 12 ? 'PM' : 'AM';
  istHours = istHours % 12; // Convert to 12-hour format
  istHours = istHours ? istHours : 12; // The hour '0' should be '12'

  // Format minutes to always be two digits
  const formattedMinutes = istMinutes < 10 ? '0' + istMinutes : istMinutes;

  // Construct the final formatted time string
  const formattedISTTime = `${istHours}:${formattedMinutes} ${ampm}`;

  return formattedISTTime; // Returns time in HH:mm AM/PM format
}
