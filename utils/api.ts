
import { Income, Expense, Subscription, Bill, AccountDetails, Todo } from '../types';
import mockData from '../mock-data.json';
import { useMockData } from './config';

const API_BASE_URL = '/api';

const fetchData = <T>(endpoint: string, mockDataKey: keyof typeof mockData): Promise<T[]> => {
    if (useMockData) {
        return Promise.resolve(mockData[mockDataKey] as unknown as T[]);
    }
    return fetch(`${API_BASE_URL}/${endpoint}`).then(res => res.json());
};

const saveData = <T>(endpoint: string, data: T, mockDataKey: keyof typeof mockData): Promise<T> => {
    if (useMockData) {
        (mockData[mockDataKey] as unknown as T[]).push(data);
        // In a real app, you would save the updated mockData to the file system or a mock server.
        // For this example, we'''ll just log it.
        console.log('Updated mock data:', mockData);
        return Promise.resolve(data);
    }
    return fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(res => res.json());
};

const updateData = <T extends { id: number }>(endpoint: string, data: T, mockDataKey: keyof typeof mockData): Promise<T> => {
    if (useMockData) {
        const dataArray = mockData[mockDataKey] as unknown as T[];
        const index = dataArray.findIndex(item => item.id === data.id);
        if (index !== -1) {
            dataArray[index] = data;
            console.log('Updated mock data:', mockData);
            return Promise.resolve(data);
        }
        return Promise.reject('Item not found');
    }
    return fetch(`${API_BASE_URL}/${endpoint}/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(res => res.json());
};

const deleteData = (endpoint: string, id: number, mockDataKey: keyof typeof mockData): Promise<void> => {
    if (useMockData) {
        const dataArray = mockData[mockDataKey] as unknown as { id: number }[];
        const index = dataArray.findIndex(item => item.id === id);
        if (index !== -1) {
            dataArray.splice(index, 1);
            console.log('Updated mock data:', mockData);
            return Promise.resolve();
        }
        return Promise.reject('Item not found');
    }
    return fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
    }).then(() => {});
};


export const getIncomes = (): Promise<Income[]> => fetchData('incomes', 'incomes');
export const addIncome = (income: Omit<Income, 'id'>): Promise<Income> => saveData('incomes', { ...income, id: Date.now() }, 'incomes');
export const updateIncome = (income: Income): Promise<Income> => updateData('incomes', income, 'incomes');
export const deleteIncome = (id: number): Promise<void> => deleteData('incomes', id, 'incomes');

export const getExpenses = (): Promise<Expense[]> => fetchData('expenses', 'expenses');
export const addExpense = (expense: Omit<Expense, 'id'>): Promise<Expense> => saveData('expenses', { ...expense, id: Date.now() }, 'expenses');
export const updateExpense = (expense: Expense): Promise<Expense> => updateData('expenses', expense, 'expenses');
export const deleteExpense = (id: number): Promise<void> => deleteData('expenses', id, 'expenses');

export const getSubscriptions = (): Promise<Subscription[]> => fetchData('subscriptions', 'subscriptions');
export const addSubscription = (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => saveData('subscriptions', { ...subscription, id: Date.now() }, 'subscriptions');
export const updateSubscription = (subscription: Subscription): Promise<Subscription> => updateData('subscriptions', subscription, 'subscriptions');
export const deleteSubscription = (id: number): Promise<void> => deleteData('subscriptions', id, 'subscriptions');

export const getBills = (): Promise<Bill[]> => fetchData('bills', 'bills');
export const addBill = (bill: Omit<Bill, 'id'>): Promise<Bill> => saveData('bills', { ...bill, id: Date.now() }, 'bills');
export const updateBill = (bill: Bill): Promise<Bill> => updateData('bills', bill, 'bills');
export const deleteBill = (id: number): Promise<void> => deleteData('bills', id, 'bills');

export const getAccounts = (): Promise<AccountDetails[]> => fetchData('accounts', 'accounts');
export const addAccount = (account: Omit<AccountDetails, 'id'>): Promise<AccountDetails> => saveData('accounts', { ...account, id: Date.now() }, 'accounts');
export const updateAccount = (account: AccountDetails): Promise<AccountDetails> => updateData('accounts', account, 'accounts');
export const deleteAccount = (id: number): Promise<void> => deleteData('accounts', id, 'accounts');

export const getTodos = (): Promise<Todo[]> => fetchData('todos', 'todos');
export const addTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => saveData('todos', { ...todo, id: Date.now() }, 'todos');
export const updateTodo = (todo: Todo): Promise<Todo> => updateData('todos', todo, 'todos');
export const deleteTodo = (id: number): Promise<void> => deleteData('todos', id, 'todos');
