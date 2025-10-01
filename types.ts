export enum Tab {
  DASHBOARD = 'Dashboard',
  INCOME = 'Income',
  EXPENSES = 'Expenses',
  SUBSCRIPTIONS = 'Subscriptions',
  BILLS = 'Bills',
  ACCOUNTS = 'Accounts',
  TODO = 'To-Do List',
}

export interface Currency {
  symbol: string;
  code: 'USD' | 'GBP' | 'EUR';
}

export interface Income {
  id: number;
  source: string;
  category: string;
  amount: number;
  date: string;
  account: string;
}

export enum ExpenseCategory {
    Food = 'Food',
    Transport = 'Transport',
    Entertainment = 'Entertainment',
    Utilities = 'Utilities',
    Healthcare = 'Healthcare',
    Shopping = 'Shopping'
}

export interface Expense {
  id: number;
  item: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  account: string;
}

export interface Subscription {
  id: number;
  service: string;
  amount: number;
  frequency: 'Monthly' | 'Yearly';
  nextPayment: string;
  status: 'Active' | 'Cancelled';
}

export interface Bill {
  id: number;
  name: string;
  dueDate: string;
  amount: number;
  category: string;
  status: 'Pending' | 'Paid';
}

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  gradient: string;
}

export enum Priority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low'
}

export interface Todo {
  id: number;
  task: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
}
