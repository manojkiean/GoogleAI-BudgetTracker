import React, { useState, useEffect } from 'react';
import { GoalDetails, Currency, Goal } from '../utils/types';
import GoalSettings from './GoalSettings';
import GoalList from './GoalList';
import { incomeSourceOptions as incomeOptionsConstant, expenseSourceOptions as expenseOptionsConstant } from '../utils/constants';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../utils/api';

interface GoalsProps {
  currency: Currency;
}

const incomeSourceOptions = incomeOptionsConstant
    .filter((item: any) => item.goal === Goal.SAVINGS)
    .map((item: any) => item.source);

const expenseSourceOptions = expenseOptionsConstant
    .filter((item: any) => item.goal === Goal.SAVINGS)
    .map((item: any) => item.source);

const Goals: React.FC<GoalsProps> = ({ currency }) => {
  const [activeTab, setActiveTab] = useState('Income');
  const [goals, setGoals] = useState<GoalDetails[]>([]);
  const [editingGoal, setEditingGoal] = useState<GoalDetails | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const goalsFromApi = await getGoals();
      setGoals(goalsFromApi);
    } catch (error) {
      setMessage('Failed to fetch goals.');
      setMessageType('error');
    }
  };

  const handleSaveGoal = async (goal: Omit<GoalDetails, 'id'> & { id?: number }) => {
    try {
      if (goal.id) {
        const updatedGoal = await updateGoal({ ...goal, id: goal.id } as GoalDetails);
        setGoals(goals.map(g => (g.id === updatedGoal.id ? updatedGoal : g)));
        setMessage('Goal updated successfully!');
        setMessageType('success');
      } else {
        const newGoal = await addGoal(goal);
        setGoals([...goals, newGoal]);
        setMessage('Goal added successfully!');
        setMessageType('success');
      }
      setEditingGoal(null);
    } catch (error) {
      setMessage('Failed to save goal.');
      setMessageType('error');
    } finally {
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
      setMessage('Goal deleted successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to delete goal.');
      setMessageType('error');
    } finally {
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
    }
  };

  const handleEditGoal = (goal: GoalDetails) => {
    setEditingGoal(goal);
  };

  const filteredGoals = goals.filter(goal => goal.type === activeTab);

  return (
    <section aria-labelledby="goals-heading">
      <h2 id="goals-heading" className="text-2xl font-bold text-white mb-6">Goal Settings</h2>
      {message && (
        <div className={`p-4 rounded-md mt-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {message}
        </div>
      )}
      {editingGoal ? (
        <GoalSettings
          type={editingGoal.type}
          onSave={handleSaveGoal}
          currency={currency}
          sourceOptions={editingGoal.type === 'Income' ? incomeSourceOptions : expenseSourceOptions}
          initialData={editingGoal}
        />
      ) : (
        <>
          <div className="flex border-b border-gray-700 mb-6">
            <button onClick={() => setActiveTab('Income')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'Income' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}`}>Income Goals</button>
            <button onClick={() => setActiveTab('Expense')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'Expense' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}`}>Expense Goals</button>
          </div>
          {activeTab === 'Income' ? (
            <GoalSettings type="Income" onSave={handleSaveGoal} currency={currency} sourceOptions={incomeSourceOptions} />
          ) : (
            <GoalSettings type="Expense" onSave={handleSaveGoal} currency={currency} sourceOptions={expenseSourceOptions} />
          )}
        </>
      )}
      <GoalList goals={filteredGoals} currency={currency} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
    </section>
  );
};

export default Goals;