
import React, { useState } from 'react';
import { GoalSettingDetails, Currency, Goal } from '../utils/types';
import GoalSettings from './AddEditGoalSettings';
import GoalSettingsCards from './GoalSettingsCards';
import { incomeSourceOptions as incomeOptionsConstant, expenseSourceOptions as expenseOptionsConstant } from '../utils/constants';
import { addGoalSettings, updateGoalSettings, deleteGoalSettings } from '../utils/api';

interface GoalSettingGridProps {
  currency: Currency;
  goals: GoalSettingDetails[];
  onGoalsUpdate: () => void;
}

const incomeSourceOptions = incomeOptionsConstant
    .filter((item: any) => item.goal === Goal.SAVINGS)
    .map((item: any) => item.source);

const expenseSourceOptions = expenseOptionsConstant
    .filter((item: any) => item.goal === Goal.SAVINGS)
    .map((item: any) => item.source);

const GoalSettingGrid: React.FC<GoalSettingGridProps> = ({ currency, goals, onGoalsUpdate }) => {
  const [activeTab, setActiveTab] = useState('Income');
  const [editingGoal, setEditingGoal] = useState<GoalSettingDetails | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleSaveGoal = async (goal: Omit<GoalSettingDetails, 'id'> & { id?: number }) => {
    try {
      if (goal.id) {
        await updateGoalSettings({ ...goal, id: goal.id } as GoalSettingDetails);
        setMessage('Goal settings updated successfully!');
        setMessageType('success');
      } else {
        await addGoalSettings(goal);
        setMessage('Goal settings added successfully!');
        setMessageType('success');
      }
      setEditingGoal(null);
      onGoalsUpdate();
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
      await deleteGoalSettings(id);
      setMessage('Goal settings deleted successfully!');
      setMessageType('success');
      onGoalsUpdate();
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

  const handleEditGoal = (goal: GoalSettingDetails) => {
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
      <GoalSettingsCards goals={filteredGoals} currency={currency} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
    </section>
  );
};

export default GoalSettingGrid;
