import { addMonths, addYears, differenceInCalendarDays, isAfter, startOfDay } from 'date-fns';

export type AgeResult = {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
};

export type AgeDifferenceResult = {
  years: number;
  months: number;
  days: number;
};

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function normalize(date: Date): Date {
  return startOfDay(date);
}

function getCalendarDiff(startDate: Date, endDate: Date): AgeDifferenceResult {
  const start = normalize(startDate);
  const end = normalize(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let yearAnchor = addYears(start, years);

  if (isAfter(yearAnchor, end)) {
    years -= 1;
    yearAnchor = addYears(start, years);
  }

  let months = (end.getFullYear() - yearAnchor.getFullYear()) * 12 + (end.getMonth() - yearAnchor.getMonth());
  let monthAnchor = addMonths(yearAnchor, months);

  if (isAfter(monthAnchor, end)) {
    months -= 1;
    monthAnchor = addMonths(yearAnchor, months);
  }

  const days = differenceInCalendarDays(end, monthAnchor);

  return { years, months, days };
}

export function calculateAge(dateOfBirth: Date, atDate: Date): AgeResult {
  const dob = normalize(dateOfBirth);
  const at = normalize(atDate);

  if (isAfter(dob, at)) {
    throw new Error('Date of birth cannot be after the calculation date.');
  }

  const calendarDiff = getCalendarDiff(dob, at);
  const totalDays = differenceInCalendarDays(at, dob);

  return {
    years: calendarDiff.years,
    months: calendarDiff.years * 12 + calendarDiff.months,
    weeks: Math.floor(totalDays / 7),
    days: totalDays,
    hours: totalDays * 24,
    minutes: totalDays * 24 * 60,
  };
}

export function calculateAgeDifference(firstDate: Date, secondDate: Date): AgeDifferenceResult {
  const first = normalize(firstDate);
  const second = normalize(secondDate);

  if (first.getTime() === second.getTime()) {
    return { years: 0, months: 0, days: 0 };
  }

  const [start, end] = isAfter(first, second) ? [second, first] : [first, second];
  return getCalendarDiff(start, end);
}
