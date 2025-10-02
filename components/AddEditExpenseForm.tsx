
import React, { useState, useEffect } from 'react';
import { ExpenseSource, Account, Goal } from '../types';
import type { Expense } from '../types';
import { expenseSourceOptions } from '../constants';

interface AddEditExpenseFormProps {
  expense: Expense | null;
  onSave: (expenseData: Omit<Expense, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

const AddEditExpenseForm: React.FC<AddEditExpenseFormProps> = ({ expense, onSave, onCancel }) => {
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseSource>(ExpenseSource.FOOD);
    const [date, setDate] = useState('');
    const [account, setAccount] = useState<Account>(Account.HSBC);

    useEffect(() => {
        if (expense) {
            setItem(expense.item);
            setAmount(expense.amount.toString());
            setCategory(expense.category);
            setDate(expense.date);
            setAccount(expense.account);
        } else {
            setItem('');
            setAmount('');
            setCategory(ExpenseSource.FOOD);
            setDate(new Date().toISOString().split('T')[0]);
            setAccount(Account.HSBC);
        }
    }, [expense]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const expenseData = {
            item,
            amount: parseFloat(amount),
            category,
            date,
            account,
        };
        onSave(expense ? { ...expenseData, id: expense.id } : expenseData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="item" className="block text-sm font-medium text-gray-300">Item</label>
                    <input type="text" id="item" value={item} onChange={(e) => setItem(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseSource)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        {expenseSourceOptions.filter(s => s.goal === Goal.EXPENSES).map(s => <option key={s.source} value={s.source}>{s.source}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-300">Account</label>
                    <select id="account" value={account} onChange={(e) => setAccount(e.target.value as Account)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        {Object.values(Account).map(acc => <option key={acc} value={acc}>{acc}</option>)}
                    </select>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300">{expense ? 'Update' : 'Add'}</button>
            </div>
        </form>
    );
};

export default AddEditExpenseForm;
