"use client";

import { useState, useEffect } from "react";
import { format, subMonths, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/models/transaction";
import { ChartContainer, ChartTooltip } from "./chart-utils";

interface MonthlyExpenseData {
  name: string;
  expenses: number;
  income: number;
  month: string;
}

export function MonthlyExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const [data, setData] = useState<MonthlyExpenseData[]>([]);

  useEffect(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const monthStr = format(date, "yyyy-MM");
      return {
        name: format(date, "MMM"),
        month: monthStr,
        expenses: 0,
        income: 0,
      };
    }).reverse();

    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthStr = format(date, "yyyy-MM");
      
      const monthIndex = acc.findIndex(item => item.month === monthStr);
      if (monthIndex === -1) return acc;
      
      if (transaction.category === "Income") {
        acc[monthIndex].income += transaction.amount;
      } else {
        acc[monthIndex].expenses += transaction.amount;
      }
      
      return acc;
    }, last6Months);

    setData(monthlyData);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <ChartTooltip>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-red-500 dark:text-red-400">
            Expenses: ${payload[0].value?.toFixed(2)}
          </p>
          <p className="text-sm text-green-500 dark:text-green-400">
            Income: ${payload[1].value?.toFixed(2)}
          </p>
        </ChartTooltip>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Your income and expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                fontSize={12}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}