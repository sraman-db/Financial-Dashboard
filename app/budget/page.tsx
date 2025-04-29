"use client";

import { useState, useEffect } from "react";
import { Nav } from "@/components/nav";
import { BudgetForm } from "@/components/dashboard/budget-form";
import { BudgetVsActualChart } from "@/components/dashboard/charts/budget-vs-actual-chart";
import { Budget, getCurrentMonthYear } from "@/lib/models/budget";
import { Transaction } from "@/lib/models/transaction";
import { useToast } from "@/hooks/use-toast";

export default function BudgetPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const { toast } = useToast();
  
  const currentMonth = getCurrentMonthYear();

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, []);

  const handleBudgetUpdate = (updatedBudget: Budget) => {
    setBudget(updatedBudget);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Budget Management</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <BudgetForm onBudgetUpdate={handleBudgetUpdate} />
            </div>
            <div>
              <BudgetVsActualChart transactions={transactions} budget={budget} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}