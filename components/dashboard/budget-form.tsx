"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { predefinedCategories } from "@/lib/models/transaction";
import { Budget, getCurrentMonthYear } from "@/lib/models/budget";

const formSchema = z.object({
  month: z.string(),
  categories: z.record(z.string(), z.coerce.number().min(0)),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  onBudgetUpdate: (budget: Budget) => void;
}

export function BudgetForm({ onBudgetUpdate }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budget, setBudget] = useState<Budget | null>(null);
  const { toast } = useToast();

  const currentMonth = getCurrentMonthYear();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: currentMonth,
      categories: predefinedCategories
        .filter(category => category !== "Income")
        .reduce((acc, category) => {
          acc[category] = 0;
          return acc;
        }, {} as Record<string, number>),
    },
  });

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`/api/budgets?month=${currentMonth}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.categories) {
            setBudget(data);
            form.reset({
              month: currentMonth,
              categories: {
                ...form.getValues().categories,
                ...data.categories,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    };

    fetchBudget();
  }, [currentMonth]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save budget');
      }
      
      const data = await response.json();
      
      toast({
        title: "Budget updated",
        description: "Your budget has been saved successfully.",
      });
      
      // Fetch the updated budget
      const updatedBudgetResponse = await fetch(`/api/budgets?month=${currentMonth}`);
      if (updatedBudgetResponse.ok) {
        const updatedBudget = await updatedBudgetResponse.json();
        setBudget(updatedBudget);
        onBudgetUpdate(updatedBudget);
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const readableMonth = currentMonth ? format(new Date(`${currentMonth}-01`), "MMMM yyyy") : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget</CardTitle>
        <CardDescription>Set your spending limits for {readableMonth}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...form.register("month")} />
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {predefinedCategories
                .filter(category => category !== "Income")
                .map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={`categories.${category}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{category}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              className="pl-7"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Budget"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}