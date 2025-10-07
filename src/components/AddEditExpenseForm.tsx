
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Account, ExpenseSource, TransactionType, Goal } from '../utils/types';
import { expenseSourceOptions } from '../utils/constants';
import TransactionList from './TransactionList';
import { formatDate } from '../utils/date';

interface AddEditExpenseFormProps {
  expense?: Transaction | null;
  transactions: Transaction[];
  onSave: (expense: Omit<Transaction, 'id'> & { id?: number }) => Promise<boolean>;
  onCancel: () => void;
  onDelete: (id: number) => void;
  onEdit: (expense: Transaction) => void;
}

const expenseOptions = expenseSourceOptions.filter(s => s.goal === Goal.EXPENSES);

const AddEditExpenseForm: React.FC<AddEditExpenseFormProps> = ({ expense, transactions, onSave, onCancel, onDelete, onEdit }) => {
  const [source, setSource] = useState('');
  const [category, setCategory] = useState<ExpenseSource | ''>(expenseOptions.length > 0 ? expenseOptions[0].source : '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<Account>(Account.HSBC);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const resetForm = () => {
    setSource('');
    setCategory(expenseOptions.length > 0 ? expenseOptions[0].source : '');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setAccount(Account.HSBC);
  };

  useEffect(() => {
    if (expense) {
      setSource(expense.source);
      setCategory(expense.category as ExpenseSource);
      setAmount(String(expense.amount));
      setDate(formatDate(expense.date, 'YYYY-MM-DD')); // Directly use the date string
      setAccount(expense.account as Account);
    } else {
      resetForm();
    }
  }, [expense]);

  const expenseTransactions = useMemo(() => {
    return transactions.filter(t => t.type === TransactionType.EXPENSE);
  }, [transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !category || !amount || isNaN(parseFloat(amount))) return;

    const success = await onSave({
      id: expense?.id,
      source,
      amount: parseFloat(amount),
      date,
      account,
      category,
      type: TransactionType.EXPENSE,
    });

    if (success) {
      setMessage({ text: 'Expense saved successfully!', type: 'success' });
      if (!expense) {
        resetForm();
      }
    } else {
      setMessage({ text: 'Failed to save expense.', type: 'error' });
    }
  };

  const handleCancel = () => {
    setMessage(null);
    onCancel();
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">{expense ? 'Edit Expense' : 'Add Expense'}</h3>
        {message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-2">Expense Item</label>
                    <input 
                        type="text"
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        placeholder='e.g. Coffee'
                        required
                    />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select 
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseSource)}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  >
                      {expenseOptions.map(s => <option key={s.source} value={s.source}>{s.source}</option>)}
                  </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <input 
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        placeholder='50'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input 
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                  Cancel
              </button>
              <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                  {expense ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
        </form>
      </div>
      <TransactionList transactions={expenseTransactions} onEdit={onEdit} onDelete={onDelete} type={TransactionType.EXPENSE} />
    </>
  );
};

export default AddEditExpenseForm;
