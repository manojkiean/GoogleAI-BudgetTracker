
import { Transaction, Bill, AccountDetails as Account, Todo, Priority, Goal, IncomeSource, ExpenseSource, Account as AccountEnum, TransactionType } from './types';

export const transactionData: Transaction[] = [];

export const billData: Bill[] = [];

export const accountData: Account[] = [];

export const todoData: Todo[] = [];

export const incomeSourceOptions: { source: IncomeSource; goal: Goal }[] = [
  { source: IncomeSource.BUSINESS, goal: Goal.SAVINGS },
  { source: IncomeSource.SALARY, goal: Goal.NONE },
  { source: IncomeSource.AIRBNB, goal: Goal.NONE },
  { source: IncomeSource.SELLING_PRODUCTS, goal: Goal.SAVINGS },
  { source: IncomeSource.CRYPTO, goal: Goal.SAVINGS },
  { source: IncomeSource.STOCKS_AND_SHARES, goal: Goal.SAVINGS },
  { source: IncomeSource.BANKING, goal: Goal.NONE },
];

export const expenseSourceOptions: { source: ExpenseSource; goal: Goal }[] = [
  { source: ExpenseSource.RENT, goal: Goal.EXPENSES },
  { source: ExpenseSource.BILLS, goal: Goal.EXPENSES },
  { source: ExpenseSource.FOOD, goal: Goal.EXPENSES },
  { source: ExpenseSource.TRANSPORTATION, goal: Goal.EXPENSES },
  { source: ExpenseSource.GADGETS, goal: Goal.SAVINGS },
  { source: ExpenseSource.OTHER, goal: Goal.EXPENSES },
  { source: ExpenseSource.PIGGY_POT, goal: Goal.SAVINGS },
  { source: ExpenseSource.PERSONAL_CARE, goal: Goal.EXPENSES },
  { source: ExpenseSource.BUYING_CAR, goal: Goal.SAVINGS },
  { source: ExpenseSource.HOLIDAYS, goal: Goal.SAVINGS },
  { source: ExpenseSource.NETFLIX, goal: Goal.SUBSCRIPTIONS },
  { source: ExpenseSource.COUNCIL_TAX, goal: Goal.SUBSCRIPTIONS },
  { source: ExpenseSource.AMAZON_PRIME, goal: Goal.SUBSCRIPTIONS },
  { source: ExpenseSource.INSURANCE, goal: Goal.SUBSCRIPTIONS },
];

export const accountOptions: AccountEnum[] = [
  AccountEnum.HSBC,
  AccountEnum.PAYPAL,
  AccountEnum.CREDIT_CARD,
  AccountEnum.VOUCHERS,
];

export const PIE_CHART_COLORS = ['#06b6d4', '#14b8a6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];

export const conversionRates = {
  USD: { GBP: 0.82, EUR: 0.95 },
  GBP: { USD: 1.22, EUR: 1.16 },
  EUR: { USD: 1.05, GBP: 0.86 },
};
