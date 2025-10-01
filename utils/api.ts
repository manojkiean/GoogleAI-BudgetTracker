
import { Income, Expense, Subscription, Bill, AccountDetails, Todo } from '../types';
import mockData from '../mock-data.json';

const saveData = (data: any) => {
    fetch('/api/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data, null, 2),
    });
};

export const getIncomes = (): Promise<Income[]> => {
  return Promise.resolve(mockData.incomes);
};

export const addIncome = (income: Omit<Income, 'id'>): Promise<Income> => {
  const newIncome = { ...income, id: Date.now() };
  mockData.incomes.push(newIncome);
  saveData(mockData);
  return Promise.resolve(newIncome);
};

export const updateIncome = (income: Income): Promise<Income> => {
    const index = mockData.incomes.findIndex(i => i.id === income.id);
    if (index !== -1) {
        mockData.incomes[index] = income;
        saveData(mockData);
        return Promise.resolve(income);
    }
    return Promise.reject('Income not found');
};

export const deleteIncome = (id: number): Promise<void> => {
    const index = mockData.incomes.findIndex(i => i.id === id);
    if (index !== -1) {
        mockData.incomes.splice(index, 1);
        saveData(mockData);
        return Promise.resolve();
    }
    return Promise.reject('Income not found');
};

export const getExpenses = (): Promise<Expense[]> => {
    return Promise.resolve(mockData.expenses);
};

export const addExpense = (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const newExpense = { ...expense, id: Date.now() };
    mockData.expenses.push(newExpense);
    saveData(mockData);
    return Promise.resolve(newExpense);
};

export const updateExpense = (expense: Expense): Promise<Expense> => {
    const index = mockData.expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
        mockData.expenses[index] = expense;
        saveData(mockData);
        return Promise.resolve(expense);
    }
    return Promise.reject('Expense not found');
};

export const deleteExpense = (id: number): Promise<void> => {
    const index = mockData.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
        mockData.expenses.splice(index, 1);
        saveData(mockData);
        return Promise.resolve();
    }
    return Promise.reject('Expense not found');
};

export const getSubscriptions = (): Promise<Subscription[]> => {
    return Promise.resolve(mockData.subscriptions);
};

export const getBills = (): Promise<Bill[]> => {
    return Promise.resolve(mockData.bills);
};

export const getAccounts = (): Promise<AccountDetails[]> => {
    return Promise.resolve(mockData.accounts);
};

export const getTodos = (): Promise<Todo[]> => {
    return Promise.resolve(mockData.todos);
};
