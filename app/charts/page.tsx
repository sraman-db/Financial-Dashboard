"use client";

import { useState, useEffect } from "react";
import { Nav } from "@/components/nav";
import { MonthlyExpenseChart } from "@/components/dashboard/charts/monthly-expense-chart";
import { CategoryPieChart } from "@/components/dashboard/charts/category-pie-chart";
import { BudgetVsActualChart } from "@/components/dashboard/charts/budget-vs-actual-chart";
import { Budget, getCurrentMonthYear } from "@/lib/models/budget";
import { Transaction } from "@/lib/models/transaction";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function ChartsPage() {
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

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Financial Charts</h1>
            <Button variant="outline" onClick={fetchData} disabled={loading} className="mt-2 md:mt-0">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
          
          <div className="grid gap-6">
            <MonthlyExpenseChart transactions={transactions} />
            
            <div className="grid gap-6 md:grid-cols-2">
              <CategoryPieChart transactions={transactions} />
              <BudgetVsActualChart transactions={transactions} budget={budget} />
            </div>
            
            {transactions.length === 0 && !loading && (
              <Card>
                <CardHeader>
                  <CardTitle>No Data Available</CardTitle>
                  <CardDescription>
                    Start by adding some transactions to visualize your financial data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Go to the Transactions page to add your first transaction.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}