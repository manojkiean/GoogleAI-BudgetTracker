import React from 'react';
import type { Currency, Expense } from '../types';
import { ExpenseCategory } from '../types';
import { expenseData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';
import { CalendarIcon, CreditCardIcon } from './icons/IconComponents';

interface ExpensesProps {
  currency: Currency;
  filter: ExpenseCategory | null;
  onClearFilter: () => void;
}

const categoryColors: Record<ExpenseCategory, string> = {
    [ExpenseCategory.Food]: 'border-red-500',
    [ExpenseCategory.Transport]: 'border-blue-500',
    [ExpenseCategory.Entertainment]: 'border-purple-500',
    [ExpenseCategory.Utilities]: 'border-yellow-500',
    [ExpenseCategory.Healthcare]: 'border-green-500',
    [ExpenseCategory.Shopping]: 'border-pink-500',
};

const ExpenseCard: React.FC<{ expense: Expense; currency: Currency }> = ({ expense, currency }) => (
    <div className={`bg-gray-800 p-4 rounded-xl shadow-lg border-l-4 ${categoryColors[expense.category]}`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="font-semibold">{expense.item}</p>
                <p className="text-sm text-gray-400">{expense.category}</p>
            </div>
            <p className="font-bold text-red-400 text-lg">
                {formatCurrency(convertAmount(expense.amount, 'USD', currency.code), currency)}
            </p>
        </div>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <div className="flex items-center">
                <CalendarIcon />
                <span className="ml-1">{expense.date}</span>
            </div>
            <div className="flex items-center">
                <CreditCardIcon />
                <span className="ml-1">{expense.account}</span>
            </div>
        </div>
    </div>
);

const Expenses: React.FC<ExpensesProps> = ({ currency, filter, onClearFilter }) => {
  const filteredExpenses = filter
    ? expenseData.filter(e => e.category === filter)
    : expenseData;

  return (
    <section aria-labelledby="expenses-heading">
      <h2 id="expenses-heading" className="text-2xl font-bold mb-6">Expenses</h2>
      {filter && (
        <div className="bg-gray-700 p-4 rounded-lg mb-6 flex justify-between items-center animate-fade-in" role="status">
          <p className="text-gray-200">
            Showing results for: <span className="font-semibold text-cyan-400">{filter}</span>
          </p>
          <button
            onClick={onClearFilter}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24 lg:mb-0">
        {filteredExpenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} currency={currency} />
        ))}
      </div>
    </section>
  );
};

export default Expenses;
