"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChartBig, 
  ListChecks, 
  Wallet, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: <ListChecks className="mr-2 h-4 w-4" />,
  },
  {
    title: "Budget",
    href: "/budget",
    icon: <Wallet className="mr-2 h-4 w-4" />,
  },
  {
    title: "Charts",
    href: "/charts",
    icon: <BarChartBig className="mr-2 h-4 w-4" />,
  },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span className="font-bold">Finance Visualizer</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex flex-col space-y-4 py-4">
              <Link href="/" className="flex items-center px-2" onClick={() => setOpen(false)}>
                <Wallet className="mr-2 h-5 w-5" />
                <span className="font-bold">Finance Visualizer</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center px-2 py-3 text-base font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between flex-1 space-x-2 md:justify-end">
          {/* Mobile Logo */}
          <div className="flex md:hidden">
            <Link href="/" className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              <span className="font-bold">Finance Visualizer</span>
            </Link>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}