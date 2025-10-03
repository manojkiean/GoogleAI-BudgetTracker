
import { supabase } from './supabase';
import { Transaction, Todo, AccountDetails } from '../types';

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) throw new Error(error.message);
    return data as Transaction[];
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await supabase.from('transactions').insert(transaction).single();
    if (error) throw new Error(error.message);
    return data as Transaction;
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
    const { id, ...updateData } = transaction;
    const { data, error } = await supabase.from('transactions').update(updateData).eq('id', id).single();
    if (error) throw new Error(error.message);
    return data as Transaction;
};

export const deleteTransaction = async (id: number): Promise<void> => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Todos
export const getTodos = async (): Promise<Todo[]> => {
    const { data, error } = await supabase.from('todos').select('id, task, priority, completed');
    if (error) throw new Error(error.message);
    return data as Todo[];
};

const destructureTodo = (todo: Omit<Todo, 'id'> | Todo) => {
    const { dueDate, ...rest } = todo as any;
    return rest;
}

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
    const newTodo = destructureTodo(todo);
    const { data, error } = await supabase.from('todos').insert(newTodo).single();
    if (error) throw new Error(error.message);
    return data as Todo;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
    const newTodo = destructureTodo(todo);
    const { data, error } = await supabase.from('todos').update(newTodo).eq('id', newTodo.id).single();
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
