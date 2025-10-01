
import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, Account } from '../types';

interface AddEditExpenseFormProps {
  expense?: Expense | null;
  onSave: (expense: Omit<Expense, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

const AddEditExpenseForm: React.FC<AddEditExpenseFormProps> = ({ expense, onSave, onCancel }) => {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.Food);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<Account>(Account.HSBC);

  useEffect(() => {
    if (expense) {
      setItem(expense.item);
      setAmount(String(expense.amount));
      setCategory(expense.category as ExpenseCategory);
      setDate(new Date(expense.date).toISOString().split('T')[0]);
      setAccount(expense.account as Account);
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !amount || isNaN(parseFloat(amount))) return;
    onSave({
      id: expense?.id,
      item,
      amount: parseFloat(amount),
      category,
      date,
      account,
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{expense ? 'Edit Expense' : 'Add Expense'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="item" className="block text-sm font-medium text-gray-300 mb-2">Expense Item</label>
                <input 
                    type="text"
                    id="item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder='e.g., Coffee'
                    required
                />
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input 
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder='15.50'
                    required
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select 
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                    {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input 
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onFocus={(e) => (e.currentTarget as any).showPicker()}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    required
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-300 mb-2">Account</label>
                <select 
                    id="account"
                    value={account}
                    onChange={(e) => setAccount(e.target.value as Account)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                    {Object.values(Account).map(acc => <option key={acc} value={acc}>{acc}</option>)}
                </select>
            </div>
        </div>
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            {expense ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditExpenseForm;
