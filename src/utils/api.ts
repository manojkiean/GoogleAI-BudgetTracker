
import { supabase } from './supabase';
import { Transaction, Todo, AccountDetails, User } from '../utils/types';

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    const { nextPayment, subscriptionType, renewalDate, ...rest } = transaction;
    const transactionData: any = { ...rest, user_id: user.id };
    if (nextPayment !== undefined) {
        transactionData.nextPayment = nextPayment;
    }
    if (subscriptionType !== undefined) {
        transactionData.subscriptionType = subscriptionType;
    }
    if (renewalDate !== undefined) {
        transactionData.renewalDate = renewalDate;
    }
    const { data: dbData, error } = await supabase.from('transactions').insert(transactionData).select();
    if (error) throw new Error(error.message);
    if (!dbData) {
        throw new Error('Failed to add transaction: Database returned null.');
    }
    const { nextpayment, subscriptiontype, renewal_date, ...returnData } = dbData[0] as any;
    return { ...returnData, nextPayment: nextpayment, subscriptionType: subscriptiontype, renewalDate: renewal_date } as Transaction;
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

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
    const { data, error } = await supabase.from('transactions').update(transactionData).eq('id', id).eq('user_id', user.id).select();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('Failed to update transaction: Database returned null.');
    }
    const { nextpayment, subscriptiontype, renewal_date, ...returnData } = data[0] as any;
    return { ...returnData, nextPayment: nextpayment, subscriptionType: subscriptiontype, renewalDate: renewal_date } as Transaction;
};

export const deleteTransaction = async (id: number): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw new Error(error.message);
};

// Todos
export const getTodos = async (): Promise<Todo[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('todos').select('id, task, dueDate, priority, completed').eq('user_id', user.id);
    if (error) throw new Error(error.message);
    if (!data) {
        return [];
    }
    return data as Todo[];
};

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');
    const todoData = { ...todo, user_id: user.id };
    const { data, error } = await supabase.from('todos').insert(todoData).select();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('Failed to add todo: Database returned null.');
    }
    return data[0] as Todo;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');
    const { data, error } = await supabase.from('todos').update(todo).eq('id', todo.id).eq('user_id', user.id).select();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('Failed to update todo: Database returned null.');
    }
    return data[0] as Todo;
};

export const deleteTodo = async (id: number): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');
    const { error } = await supabase.from('todos').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw new Error(error.message);
};

// Accounts
export const getAccounts = async (): Promise<AccountDetails[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('accounts').select('id, name, type, balance, gradient').eq('user_id', user.id);
    if (error) throw new Error(error.message);
    if (!data) {
        return [];
    }
    return data as AccountDetails[];
};

// Users
export const updateUser = async (user: User): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('User not logged in');

    const { data, error } = await supabase.from('users').update({ name: user.name }).eq('user_id', authUser.id).select();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('Failed to update user: Database returned null.');
    }
    return data[0] as User;
};