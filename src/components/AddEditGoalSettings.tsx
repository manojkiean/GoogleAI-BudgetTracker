
import React, { useState, useEffect } from 'react';
import { GoalSettingDetails, Currency } from '../utils/types';
import { formatDate } from '../utils/date';

interface AddEditGoalSettingsFormProps {
  type: 'Income' | 'Expense';
  onSave: (goal: Omit<GoalSettingDetails, 'id'> & { id?: number }) => void;
  currency: Currency;
  sourceOptions: string[];
  initialData?: GoalSettingDetails | null;
}

const AddEditGoalSettingsForm: React.FC<AddEditGoalSettingsFormProps> = ({ type, onSave, currency, sourceOptions, initialData }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(sourceOptions[0]);
  const [goalAmount, setGoalAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setGoalAmount(String(initialData.goalAmount));
      setTargetDate(initialData.targetDate ? formatDate(initialData.targetDate, 'YYYY-MM-DD') : '');
      setStatus(initialData.status || 'In Progress');
    } else {
      resetForm();
    }
  }, [initialData, sourceOptions, type]);

  const resetForm = () => {
    setName('');
    setCategory(sourceOptions[0]);
    setGoalAmount('');
    setTargetDate('');
    setStatus('In Progress');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !goalAmount) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
      return;
    }

    const goalData = {
        name,
        category,
        goalAmount: parseFloat(goalAmount) || 0,
        type,
        targetDate: targetDate || null,
        status,
    };

    if (initialData && initialData.id) {
        onSave({ ...goalData, id: initialData.id });
    } else {
        onSave(goalData);
        resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in">
      {message && (
        <div className={`p-4 rounded-md mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {message}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-4">{initialData ? 'Edit' : 'Add'} {type} Goal Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Goal Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" placeholder="e.g., New Car" required />
        </div>
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5">
                {sourceOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-300 mb-2">Target Amount ({currency.symbol})</label>
            <input type="number" id="goalAmount" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" placeholder="e.g., 1000" required />
        </div>
        <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-300 mb-2">Target Date</label>
            <input type="date" id="targetDate" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
        </div>
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
            </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300">{initialData ? 'Save Changes' : 'Add Goal Setting'}</button>
      </div>
    </form>
  );
};

export default AddEditGoalSettingsForm;
