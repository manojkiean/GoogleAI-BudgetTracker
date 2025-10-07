import React, { useState, useEffect } from 'react';
import { GoalDetails, Currency, Goal, Transaction, TransactionType } from '../types';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import { incomeSourceOptions as incomeOptionsConstant, expenseSourceOptions as expenseOptionsConstant } from '../constants';
import mockData from '../mock-data.json';

interface GoalsProps {
  currency: Currency;
}

const incomeSourceOptions = incomeOptionsConstant
  .filter(item => item.goal === Goal.SAVINGS)
  .map(item => item.source);

const expenseSourceOptions = expenseOptionsConstant
  .filter(item => item.goal === Goal.SAVINGS)
  .map(item => item.source);

const Goals: React.FC<GoalsProps> = ({ currency }) => {
  const [activeTab, setActiveTab] = useState('Income');
  const [goals, setGoals] = useState<GoalDetails[]>(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : mockData.goals;
  });
  const [editingGoal, setEditingGoal] = useState<GoalDetails | null>(null);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const fetchTransactions = (): Transaction[] => {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) as Transaction[] : mockData.transactions as Transaction[];
  };

  const handleSaveGoal = (goal: Omit<GoalDetails, 'id'> & { id?: number }) => {
    let transactions = fetchTransactions();
    const initialDeposit = goal.depositAmount || 0;

    if (!goal.id && initialDeposit > 0) {
      const newTransaction: Transaction = {
        id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
        type: goal.type === 'Income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        source: goal.name,
        category: goal.category,
        amount: initialDeposit,
        date: new Date().toISOString().split('T')[0],
        account: 'Default',
      };
      transactions = [...transactions, newTransaction];
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    const depositAmount = transactions
      .filter(t => t.category === goal.category && t.type === goal.type.toLowerCase())
      .reduce((acc, t) => acc + t.amount, 0);

    if (goal.id) {
      setGoals(goals.map(g => g.id === goal.id ? { ...g, ...goal, depositAmount } as GoalDetails : g));
    } else {
      const newGoal = { ...goal, id: goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1, depositAmount };
      setGoals([...goals, newGoal as GoalDetails]);
    }
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleEditGoal = (goal: GoalDetails) => {
    setEditingGoal(goal);
  };

  const filteredGoals = goals.filter(goal => goal.type === activeTab);

  return (
    <section aria-labelledby="goals-heading">
      <h2 id="goals-heading" className="text-2xl font-bold text-white mb-6">Financial Goals</h2>
      {editingGoal ? (
        <GoalForm
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
            <GoalForm type="Income" onSave={handleSaveGoal} currency={currency} sourceOptions={incomeSourceOptions} />
          ) : (
            <GoalForm type="Expense" onSave={handleSaveGoal} currency={currency} sourceOptions={expenseSourceOptions} />
          )}
        </>
      )}
      <GoalList goals={filteredGoals} currency={currency} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
    </section>
  );
};

export default Goals;