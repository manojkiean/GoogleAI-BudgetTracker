
import { supabase } from './supabase';
import { Transaction, Todo, AccountDetails } from '../types';

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) throw new Error(error.message);
    if (!data) {
        return [];
    }
    // Manually map snake_case to camelCase
    return data.map(t => ({
        ...t,     
        renewalDate: (t as any).renewal_date
    })) as Transaction[];
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { nextPayment, subscriptionType, renewalDate, ...rest } = transaction;
    const transactionData: any = { ...rest };
    if (nextPayment !== undefined) {
        transactionData.nextPayment = nextPayment;
    }
    if (subscriptionType !== undefined) {
        transactionData.subscriptionType = subscriptionType;
    }
    if (renewalDate !== undefined) {
        transactionData.renewalDate = renewalDate;
    }
    const { data, error } = await supabase.from('transactions').insert(transactionData).select();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('Failed to add transaction: Database returned null.');
    }
    const { nextpayment, subscriptiontype, renewal_date, ...returnData } = data[0] as any;
    return { ...returnData, nextPayment: nextpayment, subscriptionType: subscriptiontype, renewalDate: renewal_date } as Transaction;
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
    const { id, nextPayment, subscriptionType, renewalDate, ...updateData } = transaction;
    const transactionData: any = { ...updateData };

    if (nextPayment !== undefined) {
        transactionData.nextPayment = nextPayment;
    }
    if (subscriptionType !== undefined) {
        transactionData.subscriptionType = subscriptionType;
    }
    if (renewalDate !== undefined) {
        transactionData.renewalDate = renewalDate;
    }
    const { data, error } = await supabase.from('transactions').update(transactionData).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('Failed to update transaction: Database returned null.');
    }
    const { nextpayment, subscriptiontype, renewal_date, ...returnData } = data[0] as any;
    return { ...returnData, nextPayment: nextpayment, subscriptionType: subscriptiontype, renewalDate: renewal_date } as Transaction;
};

export const deleteTransaction = async (id: number): Promise<void> => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Todos
export const getTodos = async (): Promise<Todo[]> => {
    const { data, error } = await supabase.from('todos').select('id, task, dueDate, priority, completed');
    if (error) throw new Error(error.message);
    return data as Todo[];
};

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
    //const newTodo = destructureTodo(todo);
    const { data, error } = await supabase.from('todos').insert(todo);
    if (error) throw new Error(error.message);
    return data as Todo;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
    //const newTodo = destructureTodo(todo);
    const { data, error } = await supabase.from('todos').update(todo).eq('id', todo.id);
    if (error) throw new Error(error.message);
    return data as Todo;
};

export const deleteTodo = async (id: number): Promise<void> => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Accounts
export const getAccounts = async (): Promise<AccountDetails[]> => {
    const { data, error } = await supabase.from('accounts').select('id, name, type, balance, gradient');
    if (error) throw new Error(error.message);
    return data as AccountDetails[];
};
