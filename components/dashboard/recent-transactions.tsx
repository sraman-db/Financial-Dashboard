"use client";

import { format } from "date-fns";
import { Transaction } from "@/lib/models/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { 
  ShoppingBag, 
  Home, 
  Car, 
  Utensils, 
  Lightbulb, 
  Heart, 
  Briefcase,
  Shirt,
  GraduationCap,
  Gift,
  DollarSign,
  Package
} from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Housing':
        return <Home className="h-4 w-4" />;
      case 'Transportation':
        return <Car className="h-4 w-4" />;
      case 'Food':
        return <Utensils className="h-4 w-4" />;
      case 'Utilities':
        return <Lightbulb className="h-4 w-4" />;
      case 'Healthcare':
        return <Heart className="h-4 w-4" />;
      case 'Personal':
        return <ShoppingBag className="h-4 w-4" />;
      case 'Entertainment':
        return <Package className="h-4 w-4" />;
      case 'Clothing':
        return <Shirt className="h-4 w-4" />;
      case 'Education':
        return <GraduationCap className="h-4 w-4" />;
      case 'Gifts':
        return <Gift className="h-4 w-4" />;
      case 'Income':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Income':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'Housing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Food':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
      case 'Transportation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Entertainment':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No transactions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.category === "Income";
            
            return (
              <div key={transaction._id?.toString()} className="flex items-center">
                <Avatar className={`h-9 w-9 mr-3 ${getCategoryColor(transaction.category)}`}>
                  {getCategoryIcon(transaction.category)}
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), "MMM d, yyyy")} • {transaction.category}
                  </p>
                </div>
                <div className={`${isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} font-medium`}>
                  {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}