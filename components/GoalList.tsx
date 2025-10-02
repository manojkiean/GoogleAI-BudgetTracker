
import React from 'react';
import { GoalDetails, Currency } from '../types';

interface GoalListProps {
  goals: GoalDetails[];
  currency: Currency;
  onEdit?: (goal: GoalDetails) => void;
  onDelete?: (id: number) => void;
  progressBarColor?: string;
}

const GoalList: React.FC<GoalListProps> = ({ goals, currency, onEdit, onDelete, progressBarColor = 'bg-gradient-to-r from-purple-500 to-pink-500' }) => {
  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      {goals.map((goal) => (
        <div key={goal.id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">{goal.category}</span>
            <span className="text-white">{currency.symbol}{goal.amount} / {currency.symbol}{goal.goalAmount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div
              className={`${progressBarColor} h-2.5 rounded-full`}
              style={{ width: `${(goal.amount / goal.goalAmount) * 100}%` }}
            ></div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex justify-end mt-2">
              {onEdit && <button onClick={() => onEdit(goal)} className="text-sm text-gray-400 hover:text-white mr-4">Edit</button>}
              {onDelete && <button onClick={() => onDelete(goal.id)} className="text-sm text-gray-400 hover:text-white">Delete</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoalList;
