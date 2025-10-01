import React from 'react';
import type { Currency, ExpenseCategory } from '../types';
import { incomeData, expenseData, accountData } from '../constants';
import SummaryCard from './SummaryCard';
import ExpensePieChart from './charts/ExpensePieChart';
import BudgetBarChart from './charts/BudgetBarChart';
import { formatCurrency, convertAmount } from '../utils/currency';
import { DollarIcon, EuroIcon, PoundIcon, AccountsIcon as AccIcon } from './icons/IconComponents';

interface DashboardProps {
  currency: Currency;
  onCategorySelect: (category: ExpenseCategory) => void;
}

const IncomeGoal: React.FC<{ title: string; current: number; goal: number; currency: Currency }> = ({ title, current, goal, currency }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
        <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">{title}</span>
                <span className="font-semibold text-white">{formatCurrency(current, currency)} / {formatCurrency(goal, currency)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ currency, onCategorySelect }) => {
    const totalIncome = incomeData.reduce((acc, item) => acc + convertAmount(item.amount, 'USD', currency.code), 0);
    const totalExpenses = expenseData.reduce((acc, item) => acc + convertAmount(item.amount, 'USD', currency.code), 0);
    const netBalance = totalIncome - totalExpenses;
    const totalAccounts = accountData.reduce((acc, item) => acc + convertAmount(item.balance, 'USD', currency.code), 0);
    
    const sideHustleIncome = incomeData
        .filter(i => i.category === 'Side Hustle')
        .reduce((acc, item) => acc + convertAmount(item.amount, 'USD', currency.code), 0);

    return (
        <section aria-labelledby="dashboard-heading">
            <h2 id="dashboard-heading" className="sr-only">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 lg:mb-0">
                <SummaryCard title="Total Income" amount={totalIncome} currency={currency} icon={<DollarIcon />} trend="+15%" />
                <SummaryCard title="Total Expenses" amount={totalExpenses} currency={currency} icon={<PoundIcon />} trend="+5%" />
                <SummaryCard title="Net Balance" amount={netBalance} currency={currency} icon={<EuroIcon />} trend="+20%" />
                <SummaryCard title="Total Accounts" amount={totalAccounts} currency={currency} icon={<AccIcon />} trend="+2%" />

                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Expense Breakdown</h3>
                    <ExpensePieChart currency={currency} onCategoryClick={onCategorySelect} />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Budget vs Actual</h3>
                    <BudgetBarChart currency={currency} onCategoryClick={onCategorySelect} />
                </div>
                
                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gray-800 p-6 rounded-2xl shadow-lg">
                     <h3 className="text-xl font-semibold mb-4">Income Goals</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <IncomeGoal title="Monthly Goal" current={totalIncome} goal={convertAmount(7000, 'USD', currency.code)} currency={currency} />
                         <IncomeGoal title="Side Hustle Goal" current={sideHustleIncome} goal={convertAmount(2000, 'USD', currency.code)} currency={currency} />
                     </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
