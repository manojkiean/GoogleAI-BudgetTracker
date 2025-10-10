
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Account, GoalSettingDetails, TransactionType } from '../utils/types';
import { formatDate } from '../utils/date';

interface AddEditGoalFormProps {
  goal?: Transaction | null;
  transactions: Transaction[];
  goalSettings: GoalSettingDetails[];
  onSave: (goal: Omit<Transaction, 'id'> & { id?: number }) => Promise<boolean>;
  onCancel: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  key?: number;
}

const AddEditGoalForm: React.FC<AddEditGoalFormProps> = ({ goal, transactions, goalSettings, onSave, onCancel, onEdit, onDelete }) => {
  const [goalSelection, setGoalSelection] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const resetForm = () => {
    setGoalSelection('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
  };

  useEffect(() => {
    if (goal) {
      const relatedGoal = goalSettings.find(g => g.category === goal.category);
      if (relatedGoal) {
        setGoalSelection(relatedGoal.id);
      }
      setAmount(String(goal.amount));
      setDate(formatDate(goal.date, 'YYYY-MM-DD'));
      setDescription(goal.source);
    } else {
      resetForm();
    }
  }, [goal, goalSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalSelection || !amount || isNaN(parseFloat(amount))) return;

    const selectedGoal = goalSettings.find(g => g.id === goalSelection);
    if (!selectedGoal) return;

    const success = await onSave({
      id: goal?.id,
      source: selectedGoal.name,
      amount: parseFloat(amount),
      date,
      account: 'Goals',
      category: selectedGoal.category,
      goalAmount : selectedGoal.goalAmount,
      type: 'goals' as any, // casting as 'any' to add a new type
    });

    if (success) {
      setMessage({ text: 'Goal saved successfully!', type: 'success' });
      if (!goal) {
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
      }
    } else {
      setMessage({ text: 'Failed to save goal.', type: 'error' });
    }
  };

  const handleCancel = () => {
    setMessage(null);
    onCancel();
  };

  const filteredTransactions = useMemo(() => {
    const goalTransactions = transactions.filter(t => t.type === 'goals');

    if (!goalSelection) {
      return goalTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const selectedGoal = goalSettings.find(g => g.id === goalSelection);
    if (!selectedGoal) {
        return goalTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    return goalTransactions
      .filter(t => t.category === selectedGoal.category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [goalSelection, transactions, goalSettings]);


  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{goal ? 'Edit Goal Deposit' : 'Add Goal Deposit'}</h3>
      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="goalSelection" className="block text-sm font-medium text-gray-300 mb-2">Goal</label>
                  <select
                      id="goalSelection"
                      value={goalSelection}
                      onChange={(e) => setGoalSelection(Number(e.target.value))}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                      required
                  >
                    <option value="">Select a goal</option>
                    {goalSettings.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
              </div>
              <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Deposit Amount</label>
                  <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                      placeholder='100'
                      required
                  />
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                  <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                      placeholder='e.g. Monthly savings'
                  />
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
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
                {goal ? 'Save Changes' : 'Add Deposit'}
            </button>
          </div>
      </form>
      {filteredTransactions.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-4">{goalSelection ? 'Recent Deposits for Selected Goal' : 'All Goal Deposits'}</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="bg-gray-800 border-b border-gray-700">
                    <td className="px-6 py-4">{formatDate(t.date)}</td>
                    <td className="px-6 py-4">{t.amount}</td>
                    <td className="px-6 py-4">{t.source}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => onEdit(t)} className="font-medium text-cyan-500 hover:underline mr-4">Edit</button>
                      <button onClick={() => onDelete(t.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditGoalForm;
