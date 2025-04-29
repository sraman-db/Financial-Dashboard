"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil } from "lucide-react";
import { TransactionForm } from "./transaction-form";

interface TransactionDialogProps {
  transaction?: {
    _id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
  };
  trigger?: React.ReactNode;
  title?: string;
  onSuccess?: () => void;
}

export function TransactionDialog({
  transaction,
  trigger,
  title,
  onSuccess,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultTrigger = transaction ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Transaction
    </Button>
  );

  const dialogTitle = title || (transaction ? "Edit Transaction" : "Add Transaction");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}