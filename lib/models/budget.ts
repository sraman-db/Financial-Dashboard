import { ObjectId } from 'mongodb';

export type Budget = {
  _id?: ObjectId;
  month: string; // Format: YYYY-MM
  categories: {
    [category: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export function formatMonthYear(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getCurrentMonthYear(): string {
  return formatMonthYear(new Date());
}