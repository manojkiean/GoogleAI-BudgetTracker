
import React, { useState, useMemo, useEffect } from 'react';
import { Goal } from '../types';
import type { Currency, Todo, Subscription, Bill, ExpenseSource, IncomeSource, Income, Expense, AccountDetails } from '../types';
import { incomeGoalData, budgetData, incomeSourceOptions, expenseSourceOptions } from '../constants';
import SummaryCard from './SummaryCard';
import ExpensePieChart from './charts/ExpensePieChart';
import BudgetBarChart from './charts/BudgetBarChart';
import { formatCurrency, convertAmount } from '../utils/currency';
import { DollarIcon, EuroIcon, PoundIcon, AccountsIcon as AccIcon } from './icons/IconComponents';
import { getIncomes, getExpenses, getTodos, getSubscriptions, getBills, getAccounts } from '../utils/api';

interface DashboardProps {
  currency: Currency;
  onCategorySelect: (category: ExpenseSource) => void;
}

const GoalProgress: React.FC<{ title: string; current: number; goal: number; currency: Currency; colorClass: string }> = ({ title, current, goal, currency, colorClass }) => {
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    return (
        <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">{title}</span>
                <span className="text-sm text-gray-400">{formatCurrency(current, currency)} / {formatCurrency(goal, currency)}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ currency, onCategorySelect }) => {
    const [showExpenses, setShowExpenses] = useState(true);
    const [showIncomeGoals, setShowIncomeGoals] = useState(true);
    const [showExpenseGoals, setShowExpenseGoals] = useState(true);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [accounts, setAccounts] = useState<AccountDetails[]>([]);

    useEffect(() => {
        getIncomes().then(setIncomes);
        getExpenses().then(setExpenses);
        getTodos().then(setTodos);
        getSubscriptions().then(setSubscriptions);
        getBills().then(setBills);
        getAccounts().then(setAccounts);
    }, []);

    const totalIncome = useMemo(() => incomes.reduce((acc, item) => acc + convertAmount(item.amount, 'USD', currency.code), 0), [incomes, currency.code]);
    const totalExpenses = useMemo(() => expenses.reduce((acc, item) => acc + convertAmount(item.amount, 'USD', currency.code), 0), [expenses, currency.code]);
    const netBalance = totalIncome - totalExpenses;

    const incomeByCategory = useMemo(() => incomes.reduce((acc, item) => {
        const category = item.category as IncomeSource;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += convertAmount(item.amount, 'USD', currency.code);
        return acc;
    }, {} as Record<IncomeSource, number>), [incomes, currency.code]);

    const expenseByCategory = useMemo(() => expenses.reduce((acc, item) => {
        const category = item.category as ExpenseSource;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += convertAmount(item.amount, 'USD', currency.code);
        return acc;
    }, {} as Record<ExpenseSource, number>), [expenses, currency.code]);

    const upcomingTodos = useMemo(() => {
        const today = new Date();
        const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        return todos.filter(item => {
            const dueDate = new Date(item.dueDate);
            return dueDate >= today && dueDate <= nextWeek;
        });
    }, [todos]);

    return (
        <section aria-labelledby="dashboard-heading">
            <h2 id="dashboard-heading" className="sr-only">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 lg:mb-0">
                <SummaryCard title="Total Income" amount={totalIncome} currency={currency} icon={<DollarIcon />} trend="+15%" />
                <SummaryCard title="Total Expenses" amount={totalExpenses} currency={currency} icon={<PoundIcon />} trend="+5%" />
                <SummaryCard title="Net Balance" amount={netBalance} currency={currency} icon={<EuroIcon />} trend="+20%" />

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Expense Breakdown</h3>
                        <ExpensePieChart currency={currency} onCategoryClick={onCategorySelect} expenses={expenses} />
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Income</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2">
                            {incomes.map(item => (
                                <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                                    <p className="font-medium text-white">{item.source}</p>
                                    <p className="text-sm text-gray-400">{item.date}</p>
                                    <p className="font-semibold text-green-400 mt-2">{formatCurrency(convertAmount(item.amount, 'USD', currency.code), currency)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Expenses</h3>
                            <button onClick={() => setShowExpenses(!showExpenses)} className="text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none">
                                {showExpenses ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {showExpenses && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto animate-fade-in pr-2">
                                {expenses.map(item => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                                        <p className="font-medium text-white">{item.item}</p>
                                        <p className="text-sm text-gray-400">{item.date}</p>
                                        <p className="font-semibold text-red-400 mt-2">{formatCurrency(convertAmount(item.amount, 'USD', currency.code), currency)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Budget vs Actual</h3>
                        <BudgetBarChart currency={currency} onCategoryClick={onCategorySelect} expenses={expenses} />
                    </div>
                </div>
                
                <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Income Goals</h3>
                        <button onClick={() => setShowIncomeGoals(!showIncomeGoals)} className="text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none">
                            {showIncomeGoals ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {showIncomeGoals && (
                        <div className="space-y-4 animate-fade-in">
                            {incomeSourceOptions.filter(option => option.goal === Goal.SAVINGS).map(option => (
                                <GoalProgress 
                                    key={option.source}
                                    title={option.source}
                                    current={incomeByCategory[option.source] || 0}
                                    goal={convertAmount(incomeGoalData[option.source] as number || 0, 'USD', currency.code)}
                                    currency={currency}
                                    colorClass="bg-gradient-to-r from-cyan-500 to-blue-500"
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Expense Goals</h3>
                        <button onClick={() => setShowExpenseGoals(!showExpenseGoals)} className="text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none">
                            {showExpenseGoals ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {showExpenseGoals && (
                        <div className="space-y-4 animate-fade-in">
                            {expenseSourceOptions.filter(option => option.goal !== Goal.SUBSCRIPTIONS && option.goal !== Goal.EXPENSES).map(option => (
                                <GoalProgress 
                                    key={option.source}
                                    title={option.source}
                                    current={expenseByCategory[option.source] || 0}
                                    goal={convertAmount(budgetData[option.source] as number || 0, 'USD', currency.code)}
                                    currency={currency}
                                    colorClass="bg-gradient-to-r from-red-500 to-orange-500"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">To-Do List</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {upcomingTodos.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                                <div>
                                    <p className="font-medium text-white">{item.task}</p>
                                    <p className="text-sm text-gray-400">Due: {item.dueDate}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.priority === 'High' ? 'bg-red-500' : item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                    {item.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Subscriptions</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {subscriptions.filter(s => s.status === 'Active').map(sub => (
                            <div key={sub.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                                <div>
                                    <p className="font-medium text-white">{sub.service}</p>
                                    <p className="text-sm text-gray-400">Next Payment: {sub.nextPayment}</p>
                                </div>
                                <p className="font-semibold text-white">{formatCurrency(sub.amount, currency)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Bills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                        {bills.filter(b => b.status === 'Pending').map(bill => (
                            <div key={bill.id} className="bg-gray-700 p-4 rounded-lg">
                                <p className="font-medium text-white">{bill.name}</p>
                                <p className="text-sm text-gray-400">Due: {bill.dueDate}</p>
                                <p className="font-semibold text-red-400 mt-2">{formatCurrency(bill.amount, currency)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
