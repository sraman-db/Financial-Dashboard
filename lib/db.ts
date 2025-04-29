import clientPromise from './mongodb';
import { Transaction } from './models/transaction';
import { Budget } from './models/budget';
import { ObjectId } from 'mongodb';

// Transactions
export async function getTransactions() {
  const client = await clientPromise;
  const transactions = await client
    .db('finance')
    .collection<Transaction>('transactions')
    .find({})
    .sort({ date: -1 })
    .toArray();
    
  return JSON.parse(JSON.stringify(transactions));
}

export async function addTransaction(transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  const now = new Date();
  
  const result = await client
    .db('finance')
    .collection<Transaction>('transactions')
    .insertOne({
      ...transaction,
      date: new Date(transaction.date),
      createdAt: now,
      updatedAt: now,
    } as Transaction);
    
  return result;
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>) {
  const client = await clientPromise;
  
  const result = await client
    .db('finance')
    .collection<Transaction>('transactions')
    .updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...transaction,
          updatedAt: new Date(),
          ...(transaction.date ? { date: new Date(transaction.date) } : {})
        } 
      }
    );
    
  return result;
}

export async function deleteTransaction(id: string) {
  const client = await clientPromise;
  
  const result = await client
    .db('finance')
    .collection<Transaction>('transactions')
    .deleteOne({ _id: new ObjectId(id) });
    
  return result;
}

export async function getTransactionById(id: string) {
  const client = await clientPromise;
  
  const transaction = await client
    .db('finance')
    .collection<Transaction>('transactions')
    .findOne({ _id: new ObjectId(id) });
    
  return transaction ? JSON.parse(JSON.stringify(transaction)) : null;
}

// Budgets
export async function getBudget(month: string) {
  const client = await clientPromise;
  
  const budget = await client
    .db('finance')
    .collection<Budget>('budgets')
    .findOne({ month });
    
  return budget ? JSON.parse(JSON.stringify(budget)) : null;
}

export async function createOrUpdateBudget(month: string, categories: { [category: string]: number }) {
  const client = await clientPromise;
  const now = new Date();
  
  const result = await client
    .db('finance')
    .collection<Budget>('budgets')
    .updateOne(
      { month },
      { 
        $set: {
          categories,
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      { upsert: true }
    );
    
  return result;
}