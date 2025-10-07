
import React, { useMemo, useState, useEffect } from 'react';
import { DollarIcon, PoundIcon, EuroIcon, MenuIcon, IncomeIcon, ExpensesIcon, SubscriptionsIcon, TodoIcon, GoalIcon } from './icons/IconComponents';
import SummaryCard from './SummaryCard';
import ExpensePieChart from './charts/ExpensePieChart';
import BudgetBarChart from './charts/BudgetBarChart';
import { Currency, ExpenseSource, Todo, GoalDetails, Transaction, TransactionType } from '../utils/types';
import TodoList from './TodoList';
import GoalList from './GoalList';
import Calendar from './Calendar';
import { formatDate } from '../utils/date';

interface DashboardProps {
  currency: Currency;
  onCategorySelect: (category: ExpenseSource) => void;
  todos: Todo[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ currency, onCategorySelect, todos, transactions }) => {
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

  const { totalIncome, totalExpenses, netBalance, subscriptions, incomeTransactions, expenseTransactions } = useMemo(() => {
    const incomeTrans = transactions.filter(t => t.type === TransactionType.INCOME);
    const expenseTrans = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const subscriptionTrans = transactions.filter(t => t.type === TransactionType.SUBSCRIPTION);

    const totalIncomeValue = incomeTrans.reduce((acc, income) => acc + income.amount, 0);
    const totalExpensesValue = expenseTrans.reduce((acc, expense) => acc + expense.amount, 0);
    const totalSubscriptionsValue = subscriptionTrans.reduce((acc, sub) => acc + sub.amount, 0);

    const netBalanceValue = totalIncomeValue - (totalExpensesValue + totalSubscriptionsValue);

    return {
      totalIncome: totalIncomeValue,
      totalExpenses: totalExpensesValue + totalSubscriptionsValue,
      netBalance: netBalanceValue,
      subscriptions: subscriptionTrans,
      incomeTransactions: incomeTrans,
      expenseTransactions: expenseTrans,
      //expenseTransactions: [...expenseTrans, ...subscriptionTrans],
    };
  }, [transactions]);

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
                    <BudgetBarChart currency={currency} onCategoryClick={onCategorySelect} expenses={expenseTransactions} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold flex items-center"><IncomeIcon /> <span className="ml-2">Income</span></h3>
                            <button onClick={() => setShowIncomeDetails(!showIncomeDetails)} className="text-gray-400 hover:text-white">
                                <MenuIcon />
                            </button>
                        </div>
                        {showIncomeDetails && 
                          <ul className="space-y-2">
                            {incomeTransactions.map(t => (
                              <li key={t.id} className="flex justify-between items-center p-2 bg-gray-900 rounded-lg">
                                <span className="text-white">{t.source}</span>
                                <span className="text-green-400 font-semibold">{currency.symbol}{t.amount.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        }
                    </div>
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold flex items-center"><ExpensesIcon /> <span className="ml-2">Expenses</span></h3>
                            <button onClick={() => setShowExpenseDetails(!showExpenseDetails)} className="text-gray-400 hover:text-white">
                                <MenuIcon />
                            </button>
                        </div>
                        {showExpenseDetails && 
                          <ul className="space-y-2">
                            {expenseTransactions.map(t => (
                              <li key={t.id} className="flex justify-between items-center p-2 bg-gray-900 rounded-lg">
                                <span className="text-white">{t.source}</span>
                                <span className={`font-semibold ${t.type === 'subscription' ? 'text-yellow-400' : 'text-red-400'}`}>{currency.symbol}{t.amount.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        }
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
                      <div className="overflow-x-auto">
                          <table className="w-full text-left">
                              <thead>
                                  <tr className="bg-gray-900">
                                      <th className="p-4 font-semibold">Name</th>
                                      <th className="p-4 font-semibold">Frequency</th>
                                      <th className="p-4 font-semibold">Next Payment</th>
                                      <th className="p-4 font-semibold text-right">Amount</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {subscriptions.map(sub => (
                                      <tr key={sub.id} className="border-b border-gray-700">
                                          <td className="p-4">{sub.source}</td>
                                          <td className="p-4">Monthly</td>
                                          <td className="p-4">{formatDate(sub.nextPayment, 'DD-MM-YYYY')}</td>
                                          <td className="p-4 text-right text-red-400 font-semibold">{currency.symbol}{sub.amount.toFixed(2)}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
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
                        <h3 className="text-xl font-semibold flex items-.center"><ExpensesIcon /> <span className="ml-2">Expense Breakdown</span></h3>
                    </div>
                    <ExpensePieChart currency={currency} onCategoryClick={onCategorySelect} expenses={expenseTransactions} />
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
