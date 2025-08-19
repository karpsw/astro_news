import { format } from 'date-fns';

export const dateFormats = {
  /** Jan 13, 2024 */
  cardDate: 'yyyy.MM.dd hh:mm',
  /** 2024-02-26 */
  isoDate: 'yyyy-MM-dd',
  /** Tue, 16th July, 9am */
  telDate: 'dd.MM.yyyy hh:mm',
  /** Tue, 16th July, 9am */
  shortDate: 'do MMMM, haaa',
} as const;

export const formatDate = (date: Date): string => format(date, dateFormats.cardDate);

export const formatDateIso = (date: Date): string => format(date, dateFormats.isoDate);

export const telDate = (date: Date): string => format(date, dateFormats.telDate);

export const shortDate = (date: Date): string => format(date, dateFormats.shortDate);
