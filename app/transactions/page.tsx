"use client";

import { Nav } from "@/components/nav";
import { TransactionList } from "@/components/transactions/transaction-list";

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Transactions</h1>
          <TransactionList />
        </div>
      </main>
    </div>
  );
}