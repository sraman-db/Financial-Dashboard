"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Activity,
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  Users,
  RefreshCw,
} from "lucide-react";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { SummaryCard, calculateSummaryData } from "@/components/dashboard/summary-card";
import { MonthlyExpenseChart } from "@/components/dashboard/charts/monthly-expense-chart";
import { CategoryPieChart } from "@/components/dashboard/charts/category-pie-chart";
import { BudgetVsActualChart } from "@/components/dashboard/charts/budget-vs-actual-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { Budget, getCurrentMonthYear } from "@/lib/models/budget";
import { Transaction } from "@/lib/models/transaction";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const currentMonth = getCurrentMonthYear();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch transactions
      const transactionResponse = await fetch('/api/transactions');
      if (!transactionResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const transactionData = await transactionResponse.json();
      setTransactions(transactionData);
      
      // Fetch budget
      const budgetResponse = await fetch(`/api/budgets?month=${currentMonth}`);
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        setBudget(budgetData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { 
    totalIncome, 
    totalExpenses, 
    netSavings
  } = calculateSummaryData(transactions);

  const handleBudgetUpdate = (updatedBudget: Budget) => {
    setBudget(updatedBudget);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your finances as of {format(new Date(), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <TransactionDialog onSuccess={fetchData} />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <SummaryCard
              title="Total Income"
              value={`$${totalIncome.toFixed(2)}`}
              description={`as of ${format(new Date(), "MMM d, yyyy")}`}
              icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
              loading={loading}
            />
            <SummaryCard
              title="Total Expenses"
              value={`$${totalExpenses.toFixed(2)}`}
              description={`as of ${format(new Date(), "MMM d, yyyy")}`}
              icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
              loading={loading}
            />
            <SummaryCard
              title="Net Savings"
              value={`$${netSavings.toFixed(2)}`}
              description={netSavings >= 0 ? "You're saving money!" : "You're spending more than you earn"}
              icon={<DollarSign className={`h-4 w-4 ${netSavings >= 0 ? "text-green-500" : "text-red-500"}`} />}
              loading={loading}
            />
            <SummaryCard
              title="Transactions"
              value={transactions.length}
              description="Total number of transactions"
              icon={<Activity className="h-4 w-4 text-blue-500" />}
              loading={loading}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <div className="col-span-full md:col-span-1 lg:col-span-3">
              <RecentTransactions transactions={transactions} />
            </div>
            <div className="col-span-full md:col-span-1 lg:col-span-4">
              <MonthlyExpenseChart transactions={transactions} />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <CategoryPieChart transactions={transactions} />
            <BudgetVsActualChart transactions={transactions} budget={budget} />
          </div>
        </div>
      </main>
    </div>
  );
}