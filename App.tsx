
import React, { useState, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Currency, Tab, ExpenseSource } from './types';
import { mockUsers } from './utils/config';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Income = lazy(() => import('./components/Income'));
const Expenses = lazy(() => import('./components/Expenses'));
const Subscriptions = lazy(() => import('./components/Subscriptions'));
const Goals = lazy(() => import('./components/Goals'));
const Accounts = lazy(() => import('./components/Accounts'));
const TodoList = lazy(() => import('./components/TodoList'));
const Login = lazy(() => import('./components/Login'));
const MyAccount = lazy(() => import('./components/MyAccount'));

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [currency, setCurrency] = useState<Currency>({ symbol: '$', code: 'USD' });
  const [expenseFilter, setExpenseFilter] = useState<ExpenseSource | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userId: string) => {
    const user = mockUsers.find(u => u.userId === userId);
    if (user) {
        setCurrentUser({ ...user, currency: currency.code });
        setIsLoggedIn(true);
        setActiveTab(Tab.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab(Tab.DASHBOARD); 
  };

  const handleCategorySelect = useCallback((category: ExpenseSource) => {
    setExpenseFilter(category);
    setActiveTab(Tab.EXPENSES);
  }, []);

  const clearExpenseFilter = useCallback(() => {
    setExpenseFilter(null);
  }, []);

  const handleSetTab = useCallback((tab: Tab) => {
    if (activeTab === Tab.EXPENSES && tab !== Tab.EXPENSES) {
      clearExpenseFilter();
    }
    setActiveTab(tab);
  }, [activeTab, clearExpenseFilter]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    const components: Record<Tab, React.ReactNode> = {
      [Tab.DASHBOARD]: <Dashboard currency={currency} onCategorySelect={handleCategorySelect} />,
      [Tab.INCOME]: <Income currency={currency} />,
      [Tab.EXPENSES]: <Expenses currency={currency} filter={expenseFilter} onClearFilter={clearExpenseFilter} />,
      [Tab.SUBSCRIPTIONS]: <Subscriptions currency={currency} />,
      [Tab.GOALS]: <Goals currency={currency} />,
      [Tab.ACCOUNTS]: <Accounts currency={currency} />,
      [Tab.TODO]: <TodoList />,
      [Tab.MY_ACCOUNT]: <MyAccount user={currentUser} onLogout={handleLogout} />,
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
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col lg:flex-row">
      <Navigation activeTab={activeTab} setActiveTab={handleSetTab} sidebarOpen={sidebarOpen} />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64 xl:ml-72' : 'lg:ml-20'}`}>
        <Header currency={currency} setCurrency={setCurrency} toggleSidebar={toggleSidebar} />
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
