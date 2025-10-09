import React from 'react';
import { GoalDetails, Currency } from '../utils/types';
import { formatDate } from '../utils/date';

interface GoalListProps {
  goals: GoalDetails[];
  currency: Currency;
  onEdit?: (goal: GoalDetails) => void;
  onDelete?: (id: number) => void;
  progressBarColor?: string;
}

const GoalList: React.FC<GoalListProps> = ({ goals, currency, onEdit, onDelete }) => {
  if (goals.length === 0) {
    return null;
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-gradient-to-r from-green-500 to-teal-500';
      case 'In Progress':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'On Hold':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {goals.map((goal) => (
        <div key={goal.id} className={`p-4 rounded-lg shadow-md ${getStatusStyles(goal.status)}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{goal.name}</h3>
              <p className="text-sm text-gray-200">{goal.category}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">{currency.symbol}{goal.goalAmount}</p>
              <p className="text-sm font-medium text-white">
                {goal.status}
              </p>
            </div>
          </div>
          {goal.targetDate && (
            <p className="text-sm text-gray-200 mt-2">
              Target Date: {formatDate(goal.targetDate, 'DD-MM-YYYY')}
            </p>
          )}
          {(onEdit || onDelete) && (
            <div className="flex justify-end mt-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(goal)}
                  className="text-sm text-gray-200 hover:text-white mr-4"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(goal.id)}
                  className="text-sm text-gray-200 hover:text-white"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoalList;
