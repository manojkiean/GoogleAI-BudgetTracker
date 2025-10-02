
import React, { useState, useEffect } from 'react';
import { GoalDetails, Currency } from '../types';

interface GoalFormProps {
  type: 'Income' | 'Expense';
  onSave: (goal: Omit<GoalDetails, 'id'> & { id?: number }) => void;
  currency: Currency;
  sourceOptions: string[];
  initialData?: GoalDetails | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ type, onSave, currency, sourceOptions, initialData }) => {
  const [category, setCategory] = useState(sourceOptions[0]);
  const [amount, setAmount] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setAmount(String(initialData.amount));
      setGoalAmount(String(initialData.goalAmount));
    } else {
      setCategory(sourceOptions[0]);
      setAmount('');
      setGoalAmount('');
    }
  }, [initialData, sourceOptions, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      category,
      amount: parseFloat(amount) || 0,
      goalAmount: parseFloat(goalAmount) || 0,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold text-white mb-4">{initialData ? 'Edit' : 'Add'} {type} Goal</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5">
                {sourceOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Current Amount ({currency.symbol})</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" placeholder="e.g., 500" required />
        </div>
        <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-300 mb-2">Goal Amount ({currency.symbol})</label>
            <input type="number" id="goalAmount" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" placeholder="e.g., 1000" required />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300">{initialData ? 'Save Changes' : 'Add Goal'}</button>
      </div>
    </form>
  );
};

export default GoalForm;
