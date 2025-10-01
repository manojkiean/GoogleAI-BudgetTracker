import { Income, Expense, Subscription, Bill, Account, Todo, Priority, ExpenseCategory } from './types';

export const incomeData: Income[] = [
  { id: 1, source: 'Salary', category: 'Job', amount: 5000, date: '2023-10-01', account: 'Main Checking' },
  { id: 2, source: 'Freelance Project', category: 'Side Hustle', amount: 1200, date: '2023-10-05', account: 'Business Account' },
  { id: 3, source: 'Investment Dividend', category: 'Investments', amount: 350, date: '2023-10-10', account: 'Savings Account' },
  { id: 4, source: 'Birthday Gift', category: 'Gift', amount: 100, date: '2023-10-15', account: 'Main Checking' },
];

export const expenseData: Expense[] = [
  { id: 1, item: 'Groceries', category: ExpenseCategory.Food, amount: 150, date: '2023-10-02', account: 'Main Checking' },
  { id: 2, item: 'Gas', category: ExpenseCategory.Transport, amount: 50, date: '2023-10-03', account: 'Main Checking' },
  { id: 3, item: 'Movie Tickets', category: ExpenseCategory.Entertainment, amount: 30, date: '2023-10-07', account: 'Credit Card' },
  { id: 4, item: 'Electricity Bill', category: ExpenseCategory.Utilities, amount: 85, date: '2023-10-08', account: 'Main Checking' },
  { id: 5, item: 'Dinner Out', category: ExpenseCategory.Food, amount: 75, date: '2023-10-12', account: 'Credit Card' },
  { id: 6, item: 'Pharmacy', category: ExpenseCategory.Healthcare, amount: 25, date: '2023-10-14', account: 'Main Checking' },
  { id: 7, item: 'New T-shirt', category: ExpenseCategory.Shopping, amount: 40, date: '2023-10-16', account: 'Credit Card' },
  { id: 8, item: 'Train Ticket', category: ExpenseCategory.Transport, amount: 120, date: '2023-10-18', account: 'Credit Card' },
];

export const budgetData: Record<ExpenseCategory, number> = {
    [ExpenseCategory.Food]: 400,
    [ExpenseCategory.Transport]: 200,
    [ExpenseCategory.Entertainment]: 150,
    [ExpenseCategory.Utilities]: 150,
    [ExpenseCategory.Healthcare]: 100,
    [ExpenseCategory.Shopping]: 200,
};

export const subscriptionData: Subscription[] = [
  { id: 1, service: 'Netflix', amount: 15.99, frequency: 'Monthly', nextPayment: '2023-11-05', status: 'Active' },
  { id: 2, service: 'Spotify', amount: 9.99, frequency: 'Monthly', nextPayment: '2023-11-10', status: 'Active' },
  { id: 3, service: 'Adobe Creative Cloud', amount: 52.99, frequency: 'Monthly', nextPayment: '2023-11-15', status: 'Active' },
  { id: 4, service: 'Amazon Prime', amount: 139.00, frequency: 'Yearly', nextPayment: '2024-03-20', status: 'Active' },
];

export const billData: Bill[] = [
  { id: 1, name: 'Rent', dueDate: '2023-11-01', amount: 1500, category: 'Housing', status: 'Pending' },
  { id: 2, name: 'Internet', dueDate: '2023-11-10', amount: 60, category: 'Utilities', status: 'Paid' },
  { id: 3, name: 'Car Insurance', dueDate: '2023-11-15', amount: 120, category: 'Transport', status: 'Pending' },
  { id: 4, name: 'Credit Card', dueDate: '2023-11-20', amount: 350, category: 'Finance', status: 'Pending' },
];

export const accountData: Account[] = [
  { id: 1, name: 'Main Checking', type: 'Checking', balance: 3450.75, gradient: 'from-cyan-500 to-blue-500' },
  { id: 2, name: 'High-Yield Savings', type: 'Savings', balance: 15200.00, gradient: 'from-green-400 to-teal-500' },
  { id: 3, name: 'Travel Credit Card', type: 'Credit Card', balance: -480.50, gradient: 'from-purple-500 to-pink-500' },
  { id: 4, name: 'Investment Portfolio', type: 'Investment', balance: 25800.00, gradient: 'from-yellow-400 to-orange-500' },
];

export const todoData: Todo[] = [
  { id: 1, task: 'Pay credit card bill', priority: Priority.High, dueDate: '2023-11-20', completed: false },
  { id: 2, task: 'Review monthly budget', priority: Priority.Medium, dueDate: '2023-11-25', completed: false },
  { id: 3, task: 'Transfer $500 to savings', priority: Priority.Medium, dueDate: '2023-11-01', completed: true },
  { id: 4, task: 'Research investment options', priority: Priority.Low, dueDate: '2023-11-30', completed: false },
];

export const PIE_CHART_COLORS = ['#06b6d4', '#14b8a6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];

export const conversionRates = {
  USD: { GBP: 0.82, EUR: 0.95 },
  GBP: { USD: 1.22, EUR: 1.16 },
  EUR: { USD: 1.05, GBP: 0.86 },
};
