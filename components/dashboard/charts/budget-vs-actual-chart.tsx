"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/lib/models/budget";
import { Transaction } from "@/lib/models/transaction";
import { predefinedCategories } from "@/lib/models/transaction";
import { ChartContainer, ChartTooltip } from "./chart-utils";

interface BudgetData {
  name: string;
  budget: number;
  actual: number;
  remaining: number;
}

interface BudgetChartProps {
  transactions: Transaction[];
  budget: Budget | null;
}

export function BudgetVsActualChart({ transactions, budget }: BudgetChartProps) {
  const [data, setData] = useState<BudgetData[]>([]);

  useEffect(() => {
    if (!budget) return;

    const expensesByCategory = transactions
      .filter(t => t.category !== "Income" && new Date(t.date).toISOString().startsWith(budget.month))
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const chartData: BudgetData[] = Object.entries(budget.categories)
      .map(([category, budgetAmount]) => {
        const actualAmount = expensesByCategory[category] || 0;
        const remaining = Math.max(0, budgetAmount - actualAmount);
        
        return {
          name: category,
          budget: budgetAmount,
          actual: actualAmount,
          remaining: remaining,
        };
      })
      .filter(item => item.budget > 0) // Only show categories with a budget
      .sort((a, b) => b.actual - a.actual); // Sort by actual spending

    setData(chartData);
  }, [transactions, budget]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const budgetAmount = payload[0].value;
      const actualAmount = payload[1].value;
      const percentage = budgetAmount ? ((actualAmount / budgetAmount) * 100).toFixed(0) : "N/A";
      
      return (
        <ChartTooltip>
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-semibold">Budget:</span> ${budgetAmount?.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Actual:</span> ${actualAmount?.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Usage:</span> {percentage}%
          </p>
        </ChartTooltip>
      );
    }
    return null;
  };

  if (!budget || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual</CardTitle>
          <CardDescription>Compare your budget with actual spending</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">
            {!budget ? "No budget data available" : "No categories with budgets found"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
        <CardDescription>Compare your budget with actual spending</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 70, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}