
import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Currency, Tab, ExpenseSource, User, Todo, Transaction, TransactionType, AccountDetails } from './types';
import { getTodos, addTodo, updateTodo, deleteTodo, getTransactions, addTransaction, updateTransaction, deleteTransaction, getAccounts } from './utils/api';
import { formatDate } from './utils/date';
import { supabase } from './utils/supabase';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Transactions = lazy(() => import('./components/Transactions'));
const Goals = lazy(() => import('./components/Goals'));
const Accounts = lazy(() => import('./components/Accounts'));
const TodoList = lazy(() => import('./components/TodoList'));
const Login = lazy(() => import('./components/Login'));
const MyAccount = lazy(() => import('./components/MyAccount'));
const Reports = lazy(() => import('./components/Reports'));
const AddEditIncomeForm = lazy(() => import('./components/AddEditIncomeForm'));
const AddEditExpenseForm = lazy(() => import('./components/AddEditExpenseForm'));
const AddEditSubscriptionForm = lazy(() => import('./components/AddEditSubscriptionForm'));

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const user = {
            userId: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.full_name,
            avatar: session.user.user_metadata.avatar_url,
            currency: 'USD',
          };
          setCurrentUser(user);
          setIsLoggedIn(true);
          setActiveTab(Tab.DASHBOARD);
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
          setActiveTab(Tab.DASHBOARD);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
      fetchTransactions();
      fetchAccounts();
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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_ENV_SITE_URL, // ✅ no error now
      },
    });
  };
  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab(Tab.DASHBOARD);
  };

  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
    const newCurrency = currencies.find(c => c.code === user.currency);
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
  
  const onSave = async (transaction: Omit<Transaction, 'id'> & { id?: number }) => {
    try {
      const transactionWithFormattedDate = { ...transaction, date: formatDate(transaction.date) };

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
    setActiveTab(transaction.type === 'income' ? Tab.INCOME : transaction.type === 'expense' ? Tab.EXPENSE : Tab.SUBSCRIPTION);
  };

  const renderContent = () => {
    const components: Record<Tab, React.ReactNode> = {
      [Tab.DASHBOARD]: <Dashboard currency={currency} onCategorySelect={handleCategorySelect} todos={todos} transactions={transactions} />,
      [Tab.TRANSACTIONS]: <Transactions currency={currency} transactions={transactions} />,
      [Tab.INCOME]: <AddEditIncomeForm onSave={(income) => onSave({ ...income, type: TransactionType.INCOME })} onCancel={onCancel} transactions={transactions} onDelete={onDelete} onEdit={onEdit} income={editingTransaction} />,
      [Tab.EXPENSE]: <AddEditExpenseForm onSave={(expense) => onSave({ ...expense, type: TransactionType.EXPENSE })} onCancel={onCancel} transactions={transactions} onDelete={onDelete} onEdit={onEdit} expense={editingTransaction} />,
      [Tab.SUBSCRIPTION]: <AddEditSubscriptionForm onSave={(subscription) => onSave({ ...subscription, type: TransactionType.SUBSCRIPTION })} onCancel={onCancel} transactions={transactions} onDelete={onDelete} onEdit={onEdit} subscription={editingTransaction} />,
      [Tab.GOALS]: <Goals currency={currency} />,
      [Tab.ACCOUNTS]: <Accounts currency={currency} transactions={transactions} accounts={accounts} />,
      [Tab.REPORTS]: <Reports currency={currency} transactions={transactions} />,
      [Tab.TODO]: <TodoList initialTodos={todos} onUpdateTodos={updateTodos} />,
      [Tab.MY_ACCOUNT]: <MyAccount user={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />,
    };
    return components[activeTab] || components[Tab.DASHBOARD];
  };

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen bg-gray-900 text-white text-xl">Loading...</div>}>
        <Login onLogin={handleLogin} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col xl:flex-row">
      <Navigation activeTab={activeTab} setActiveTab={handleSetTab} sidebarOpen={sidebarOpen} />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'xl:ml-64 2xl:ml-72' : 'xl:ml-20'}`}>
        <Header currentUser={currentUser} setActiveTab={handleSetTab} toggleSidebar={toggleSidebar} />
        <div className="mt-8 animate-fade-in">
          <Suspense fallback={<div className="flex justify-center items-center h-full"><div className="text-white text-xl">Loading...</div></div>}>
            {renderContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;
