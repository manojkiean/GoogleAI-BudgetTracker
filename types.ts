export enum Tab {
  DASHBOARD = 'Dashboard',
  INCOME = 'Income',
  EXPENSES = 'Expenses',
  SUBSCRIPTIONS = 'Subscriptions',
  GOALS = 'Goals',
  ACCOUNTS = 'Accounts',
  TODO = 'To-Do List',
  MY_ACCOUNT = 'My Account',
}

export interface Currency {
  symbol: string;
  code: 'USD' | 'GBP' | 'EUR' | 'INR' | 'AUD' | 'SGD';
}

export interface Income {
  id: number;
  source: string;
  category: string;
  amount: number;
  date: string;
  account: Account;
}

export interface Expense {
  id: number;
  item: string;
  category: ExpenseSource;
  amount: number;
  date: string;
  account: Account;
}

export interface Subscription {
  id: number;
  service: string;
  amount: number;
  frequency: 'Monthly' | 'Yearly';
  nextPayment: string;
  status: 'Active' | 'Cancelled';
  subscriptionType: 'Recurring' | 'One Off';
  renewalDate?: string;
}

export interface GoalDetails {
    id: number;
    category: string;
    amount: number;
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
  dueDate: string;
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
  currency: string;
}
