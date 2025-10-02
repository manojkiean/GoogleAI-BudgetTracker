
import React, { useState, useEffect } from 'react';
import { Income, Account, IncomeSource, Goal } from '../types';
import { incomeSourceOptions } from '../constants';

interface AddEditIncomeFormProps {
  income?: Income | null;
  onSave: (income: Omit<Income, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

const AddEditIncomeForm: React.FC<AddEditIncomeFormProps> = ({ income, onSave, onCancel }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<Account>(Account.HSBC);
  const [category, setCategory] = useState<IncomeSource>(incomeSourceOptions[0].source);

  useEffect(() => {
    if (income) {
      setSource(income.source);
      setAmount(String(income.amount));
      setDate(new Date(income.date).toISOString().split('T')[0]);
      setAccount(income.account as Account);
      setCategory(income.category as IncomeSource);
    }
  }, [income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount || isNaN(parseFloat(amount))) return;
    onSave({
      id: income?.id,
      source,
      amount: parseFloat(amount),
      date,
      account,
      category,
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{income ? 'Edit Income' : 'Add Income'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-2">Income Item</label>
                <input 
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder="e.g., Monthly Salary"
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
                    placeholder='1000'
                    required
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Income Category</label>
                <select 
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncomeSource)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                    {incomeSourceOptions.filter(s => s.goal === Goal.NONE).map(s => <option key={s.source} value={s.source}>{s.source}</option>)}
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
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            {income ? 'Save Changes' : 'Add Income'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditIncomeForm;
