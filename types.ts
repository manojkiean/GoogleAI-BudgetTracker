
export enum Tab {
  DASHBOARD = 'Dashboard',
  TRANSACTIONS = 'Transactions',
  INCOME = 'Income',
  EXPENSE = 'Expense',
  SUBSCRIPTION = 'Subscription',
  GOALS = 'Goals',
  ACCOUNTS = 'Accounts',
  TODO = 'To-Do List',
  MY_ACCOUNT = 'My Account',
  REPORTS = 'Reports',
}

export interface Currency {
  symbol: string;
  code: 'USD' | 'GBP' | 'EUR' | 'INR' | 'AUD' | 'SGD';
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SUBSCRIPTION = 'subscription',
}

export interface Transaction {
  id: number;
  type?: TransactionType;
  source: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  frequency?: 'Weekly' | 'Monthly' | 'Yearly';
  nextPayment?: string;
  status?: 'Active' | 'Cancelled';
  subscriptionType?: 'Recurring' | 'One Off';
  renewalDate?: string;
}

export interface GoalDetails {
    id: number;
    category: string;
    depositAmount: number;
    goalAmount: number;
    type: 'Income' | 'Expense';
}

export interface AccountDetails {
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
  dueDate?: any;
  completed: boolean;
}

export interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

export enum Goal {
  SAVINGS = 'Savings',
  EXPENSES = 'Expenses',
  SUBSCRIPTIONS = 'Subscriptions',
  NONE = 'None',
}

export enum IncomeSource {
  BUSINESS = 'Business',
  SALARY = 'Salary',
  AIRBNB = 'AirBnB',
  SELLING_PRODUCTS = 'Selling Products',
  CRYPTO = 'Crypto',
  STOCKS_AND_SHARES = 'Stocks & Shares',
  BANKING = 'Banking',
}

export enum ExpenseSource {
  RENT = 'Rent or Mortgage',
  BILLS = 'Bills & Utilities',
  FOOD = 'Food',
  TRANSPORTATION = 'Transportation',
  GADGETS = 'Gadgets',
  OTHER = 'Other',
  PIGGY_POT = 'Piggy Pot',
  PERSONAL_CARE = 'Personal Care',
  BUYING_CAR = 'Buying Car',
  HOLIDAYS = 'Holidays',
  NETFLIX = 'Netflix',
  COUNCIL_TAX = 'Council Tax',
  AMAZON_PRIME = 'Amazon Prime',
  INSURANCE = 'Insurance',
}

export type ExpenseCategory = ExpenseSource;

export enum Account {
  HSBC = 'HSBC Bank',
  PAYPAL = 'Paypal',
  CREDIT_CARD = 'Credit Card',
  VOUCHERS = 'Vouchers',
}

export interface User {
  userId: string;
  name: string;
  email: string;
  currency: string;
}
