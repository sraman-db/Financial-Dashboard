import { ObjectId } from 'mongodb';

export type Transaction = {
  _id?: ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export const predefinedCategories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Personal',
  'Entertainment',
  'Clothing',
  'Education',
  'Gifts',
  'Income',
  'Other',
];

export const defaultBudgets = predefinedCategories.reduce((acc, category) => {
  if (category !== 'Income') {
    acc[category] = 0;
  }
  return acc;
}, {} as { [key: string]: number });