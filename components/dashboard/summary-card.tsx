"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/models/transaction";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function SummaryCard({
  title,
  value,
  description,
  icon,
  loading = false,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-7 w-28 bg-muted animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function calculateSummaryData(transactions: Transaction[]) {
  if (!transactions.length) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      expensesByCategory: {},
      recentTransactions: [],
    };
  }

  const totalIncome = transactions
    .filter(t => t.category === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.category !== "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.category !== "Income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    expensesByCategory,
    recentTransactions,
  };
}