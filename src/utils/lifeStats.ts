import { differenceInCalendarDays, format } from 'date-fns';

export type LifeMetrics = {
  nextBirthdayInDays: number;
  bornOn: string;
  zodiacSign: string;
  totalHeartbeats: number;
  totalSleepHours: number;
};

const zodiacRanges = [
  { sign: 'Capricorn', from: [12, 22], to: [1, 19] },
  { sign: 'Aquarius', from: [1, 20], to: [2, 18] },
  { sign: 'Pisces', from: [2, 19], to: [3, 20] },
  { sign: 'Aries', from: [3, 21], to: [4, 19] },
  { sign: 'Taurus', from: [4, 20], to: [5, 20] },
  { sign: 'Gemini', from: [5, 21], to: [6, 20] },
  { sign: 'Cancer', from: [6, 21], to: [7, 22] },
  { sign: 'Leo', from: [7, 23], to: [8, 22] },
  { sign: 'Virgo', from: [8, 23], to: [9, 22] },
  { sign: 'Libra', from: [9, 23], to: [10, 22] },
  { sign: 'Scorpio', from: [10, 23], to: [11, 21] },
  { sign: 'Sagittarius', from: [11, 22], to: [12, 21] },
] as const;

function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const range of zodiacRanges) {
    const [fromMonth, fromDay] = range.from;
    const [toMonth, toDay] = range.to;

    const inSameYearRange =
      (month === fromMonth && day >= fromDay) ||
      (month === toMonth && day <= toDay) ||
      (month > fromMonth && month < toMonth);

    const wrapsYearRange =
      fromMonth > toMonth &&
      ((month === fromMonth && day >= fromDay) ||
        (month === toMonth && day <= toDay) ||
        month > fromMonth ||
        month < toMonth);

    if (inSameYearRange || wrapsYearRange) {
      return range.sign;
    }
  }

  return 'Unknown';
}

export function getLifeMetrics(dateOfBirth: Date, atDate: Date, totalMinutes: number): LifeMetrics {
  const nextBirthdayThisYear = new Date(atDate.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
  const nextBirthday =
    nextBirthdayThisYear >= atDate
      ? nextBirthdayThisYear
      : new Date(atDate.getFullYear() + 1, dateOfBirth.getMonth(), dateOfBirth.getDate());

  const nextBirthdayInDays = differenceInCalendarDays(nextBirthday, atDate);
  const bornOn = format(dateOfBirth, 'EEEE');
  const zodiacSign = getZodiacSign(dateOfBirth);

  const averageHeartRate = 72;
  const totalHeartbeats = Math.round(totalMinutes * averageHeartRate);
  const totalSleepHours = Math.round((totalMinutes / 60) * (8 / 24));

  return {
    nextBirthdayInDays,
    bornOn,
    zodiacSign,
    totalHeartbeats,
    totalSleepHours,
  };
}
