
import React, { useMemo, useState, useEffect } from 'react';
import { DollarIcon, PoundIcon, EuroIcon, MenuIcon, IncomeIcon, ExpensesIcon, SubscriptionsIcon, TodoIcon, GoalIcon } from './icons/IconComponents';
import SummaryCard from './SummaryCard';
import ExpensePieChart from './charts/ExpensePieChart';
import BudgetBarChart from './charts/BudgetBarChart';
import mockData from '../mock-data.json';
import type { Currency, ExpenseSource, Todo, GoalDetails, Subscription } from '../types';
import TodoList from './TodoList';
import Income from './Income';
import Expenses from './Expenses';
import GoalList from './GoalList';
import Calendar from './Calendar';
import { formatDate } from '../utils/date';

const { incomes: mockIncome, expenses: mockExpenses } = mockData;

interface DashboardProps {
  currency: Currency;
  onCategorySelect: (category: ExpenseSource) => void;
  todos: Todo[];
  subscriptions: Subscription[];
}

const Dashboard: React.FC<DashboardProps> = ({ currency, onCategorySelect, todos, subscriptions }) => {
  const [showIncomeDetails, setShowIncomeDetails] = useState(true);
  const [showExpenseDetails, setShowExpenseDetails] = useState(true);
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [goals, setGoals] = useState<GoalDetails[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    window.addEventListener('storage', () => {
      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    });
  }, []);

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const totalIncomeValue = mockIncome.reduce((acc, income) => acc + income.amount, 0);
    const totalExpensesValue = mockExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    const netBalanceValue = totalIncomeValue - totalExpensesValue;
    return { totalIncome: totalIncomeValue, totalExpenses: totalExpensesValue, netBalance: netBalanceValue };
  }, []);

  const incomeGoals = goals.filter(goal => goal.type === 'Income');
  const expenseGoals = goals.filter(goal => goal.type === 'Expense');

  return (
    <section aria-labelledby="dashboard-heading">
        <h2 id="dashboard-heading" className="sr-only">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <SummaryCard title="Total Income" amount={totalIncome} currency={currency} icon={<DollarIcon />} trend="+15%" />
            <SummaryCard title="Total Expenses" amount={totalExpenses} currency={currency} icon={<PoundIcon />} trend="+5%" />
            <SummaryCard title="Net Balance" amount={netBalance} currency={currency} icon={<EuroIcon />} trend="+20%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
                 <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center"><IncomeIcon /> <span className="ml-2">Budget vs Spending</span></h3>
                    </div>
                    <BudgetBarChart currency={currency} onCategoryClick={onCategorySelect} expenses={mockExpenses} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold flex items-center"><IncomeIcon /> <span className="ml-2">Income</span></h3>
                            <button onClick={() => setShowIncomeDetails(!showIncomeDetails)} className="text-gray-400 hover:text-white">
                                <MenuIcon />
                            </button>
                        </div>
                        {showIncomeDetails && <Income currency={currency} isDashboard={true} />}
                    </div>
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold flex items-center"><ExpensesIcon /> <span className="ml-2">Expenses</span></h3>
                            <button onClick={() => setShowExpenseDetails(!showExpenseDetails)} className="text-gray-400 hover:text-white">
                                <MenuIcon />
                            </button>
                        </div>
                        {showExpenseDetails && <Expenses currency={currency} filter={null} onClearFilter={() => {}} isDashboard={true} />}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center"><SubscriptionsIcon /> <span className="ml-2">Subscriptions</span></h3>
        <button onClick={() => setShowSubscriptions(!showSubscriptions)} className="text-gray-400 hover:text-white">
            <MenuIcon />
        </button>
    </div>
    {showSubscriptions && (
        <ul className="space-y-4">
            {subscriptions.map(sub => (
                <li key={sub.id} className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center bg-gray-800 p-4 rounded-lg">
                    <span className="text-white font-medium sm:col-span-1">{sub.service}</span>
                    <span className="text-gray-400 text-right sm:text-center">{sub.frequency}</span>
                    <span className="text-gray-400 sm:text-center">Next: {formatDate(sub.nextPayment)}</span>
                    <span className="text-red-400 font-semibold text-right">{currency.symbol} {sub.amount.toFixed(2)}</span>
                </li>
            ))}
        </ul>
    )}
</div>
<div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center"><TodoIcon /> <span className="ml-2">To-Do List</span></h3>
                    </div>
                    <TodoList initialTodos={todos} isDashboard={true} />
                </div>
            </div>

            <div className="flex flex-col gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center"><ExpensesIcon /> <span className="ml-2">Expense Breakdown</span></h3>
                    </div>
                    <ExpensePieChart currency={currency} onCategoryClick={onCategorySelect} expenses={mockExpenses} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><GoalIcon /> <span className="ml-2">Income Goals</span></h3>
                        <GoalList goals={incomeGoals} currency={currency} progressBarColor="bg-gradient-to-r from-green-400 to-blue-500" />
                    </div>
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><GoalIcon /> <span className="ml-2">Expense Goals</span></h3>
                        <GoalList goals={expenseGoals} currency={currency} progressBarColor="bg-gradient-to-r from-red-500 to-orange-500" />
                    </div>
                </div>
                 <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <Calendar subscriptions={subscriptions} todos={todos} />
                </div>
            </div>
        </div>
    </section>
  );
};

export default Dashboard;
