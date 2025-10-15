/// <reference path="vite-env.d.ts" />

import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import {
  Currency,
  Tab,
  ExpenseSource,
  User,
  Todo,
  Transaction,
  TransactionType,
  AccountDetails,
  GoalSettingDetails,
} from './utils/types';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getAccounts,
  getGoalSettings,
  updateUser,
} from './utils/api';
import { formatDate } from './utils/date';
import { supabase } from './utils/supabase';
import { incomeSourceOptions } from './utils/constants';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Transactions = lazy(() => import('./components/Transactions'));
const AddEditGoalSettingsForm = lazy(() => import('./components/AddEditGoalSettings'));
const GoalSettingGrid = lazy(() => import('./components/GoalSettingGrid'));
const Accounts = lazy(() => import('./components/Accounts'));
const TodoList = lazy(() => import('./components/TodoList'));
const Login = lazy(() => import('./components/Login'));
const MyAccount = lazy(() => import('./components/MyAccount'));
const Reports = lazy(() => import('./components/Reports'));
const AddEditIncomeForm = lazy(() => import('./components/AddEditIncomeForm'));
const AddEditExpenseForm = lazy(() => import('./components/AddEditExpenseForm'));
const AddEditSubscriptionForm = lazy(() => import('./components/AddEditSubscriptionForm'));
const AddEditGoalForm = lazy(() => import('./components/AddEditGoalForm'));

const currencies: Currency[] = [
  { symbol: '$', code: 'USD' },
  { symbol: '£', code: 'GBP' },
  { symbol: '€', code: 'EUR' },
  { symbol: '₹', code: 'INR' },
  { symbol: 'A$', code: 'AUD' },
  { symbol: 'S$', code: 'SGD' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<AccountDetails[]>([]);
  const [goalSettings, setGoalSettings] = useState<GoalSettingDetails[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [goalSettingsVersion, setGoalSettingsVersion] = useState(0);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = {
          userId: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name,
          avatar: session.user.user_metadata.avatar_url,
          currency: 'GBP',
        };
        setCurrentUser(user);
        setIsLoggedIn(true);
        setActiveTab(Tab.DASHBOARD);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setActiveTab(Tab.DASHBOARD);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
      fetchTransactions();
      fetchAccounts();
      fetchGoalSettings();
    }
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    const todos = await getTodos();
    setTodos(todos);
  };

  const fetchTransactions = async () => {
    const transactions = await getTransactions();
    setTransactions(transactions);
  };

  const fetchAccounts = async () => {
    const accounts = await getAccounts();
    setAccounts(accounts);
  };

  const fetchGoalSettings = async () => {
    const goalSettings = await getGoalSettings();
    setGoalSettings(goalSettings);
    setGoalSettingsVersion(prevVersion => prevVersion + 1);
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_ENV_SITE_URL,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab(Tab.DASHBOARD);
  };

  const handleUpdateUser = async (user: User) => {
    //const updatedUser = await updateUser(user);
    setCurrentUser(user);
    const newCurrency = currencies.find((c) => c.code === user.currency);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  const handleCategorySelect = useCallback((category: ExpenseSource) => {
    setActiveTab(Tab.TRANSACTIONS);
  }, []);

  const handleSetTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setEditingTransaction(null);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const updateTodos = async () => {
    fetchTodos();
  };

  // ✅ FIXED: relaxed type for flexibility
  const onSave = async (transaction: Partial<Transaction>) => {
    try {
      const transactionWithFormattedDate = transaction.date
        ? { ...transaction, date: formatDate(transaction.date) }
        : transaction;

      if (transactionWithFormattedDate.id) {
        await updateTransaction(transactionWithFormattedDate as Transaction);
      } else {
        await addTransaction(transactionWithFormattedDate as Omit<Transaction, 'id'>);
      }

      await fetchTransactions();
      setEditingTransaction(null);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onCancel = () => {
    setEditingTransaction(null);
  };

  const onDelete = async (id: number) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  const onEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab(
      transaction.type === 'income'
        ? Tab.INCOME
        : transaction.type === 'expense'
        ? Tab.EXPENSE
        : transaction.type === 'subscription'
        ? Tab.SUBSCRIPTION
        : Tab.ADD_GOAL_DEPOSIT
    );
  };

  const renderContent = () => {
    const components: Record<Tab, React.ReactNode> = {
      [Tab.DASHBOARD]: (
        <Dashboard
          currency={currency}
          onCategorySelect={handleCategorySelect}
          todos={todos}
          transactions={transactions}
        />
      ),
      [Tab.TRANSACTIONS]: (
        <Transactions currency={currency} transactions={transactions} />
      ),
      [Tab.INCOME]: (
        <AddEditIncomeForm
          onSave={(income) => onSave({ ...income, type: TransactionType.INCOME })}
          onCancel={onCancel}
          transactions={transactions}
          onDelete={onDelete}
          onEdit={onEdit}
          income={editingTransaction}
        />
      ),
      [Tab.EXPENSE]: (
        <AddEditExpenseForm
          onSave={(expense) => onSave({ ...expense, type: TransactionType.EXPENSE })}
          onCancel={onCancel}
          transactions={transactions}
          onDelete={onDelete}
          onEdit={onEdit}
          expense={editingTransaction}
        />
      ),
      [Tab.SUBSCRIPTION]: (
        <AddEditSubscriptionForm
          onSave={(subscription) =>
            onSave({ ...subscription, type: TransactionType.SUBSCRIPTION })
          }
          onCancel={onCancel}
          transactions={transactions}
          onDelete={onDelete}
          onEdit={onEdit}
          subscription={editingTransaction}
        />
      ),
      [Tab.GOALSETTINGS]: (
        <GoalSettingGrid currency={currency} goals={goalSettings} onGoalsUpdate={fetchGoalSettings} />
      ),
      [Tab.ADD_GOAL_DEPOSIT]: (
        <AddEditGoalForm
          key={goalSettingsVersion}
          onSave={(goal) => onSave({ ...goal, type: TransactionType.GOALS })}
          onCancel={onCancel}
          transactions={transactions}
          goalSettings={goalSettings}
          goal={editingTransaction}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
      [Tab.ACCOUNTS]: (
        <Accounts currency={currency} transactions={transactions} accounts={accounts} />
      ),
      [Tab.REPORTS]: <Reports currency={currency} transactions={transactions} />,
      [Tab.TODO]: <TodoList initialTodos={todos} onUpdateTodos={updateTodos} />,
      [Tab.MY_ACCOUNT]: currentUser ? (
        <MyAccount
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      ) : null,
    };

    return components[activeTab] || components[Tab.DASHBOARD];
  };

  if (!isLoggedIn) {
    return (
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-xl">
            Loading...
          </div>
        }
      >
        <Login onLogin={handleLogin} />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

      <Navigation activeTab={activeTab} setActiveTab={handleSetTab} sidebarOpen={sidebarOpen} />
      <main
        className={`relative z-10 flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64 xl:ml-72' : 'lg:ml-20'
        }`}
      >
        <Header currentUser={currentUser} setActiveTab={handleSetTab} toggleSidebar={toggleSidebar} activeTab={activeTab} />
        <div className="mt-8 animate-fade-in">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <div className="text-white text-xl">Loading...</div>
              </div>
            }
          >
            {renderContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;
