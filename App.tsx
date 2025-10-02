
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Subscriptions from './components/Subscriptions';
import Bills from './components/Bills';
import Accounts from './components/Accounts';
import TodoList from './components/TodoList';
import { Currency, Tab, ExpenseCategory } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [currency, setCurrency] = useState<Currency>({ symbol: '$', code: 'USD' });
  const [expenseFilter, setExpenseFilter] = useState<ExpenseCategory | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCategorySelect = useCallback((category: ExpenseCategory) => {
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
      [Tab.BILLS]: <Bills currency={currency} />,
      [Tab.ACCOUNTS]: <Accounts currency={currency} />,
      [Tab.TODO]: <TodoList />,
    };
    return components[activeTab] || components[Tab.DASHBOARD];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col lg:flex-row">
      <Navigation activeTab={activeTab} setActiveTab={handleSetTab} sidebarOpen={sidebarOpen} />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64 xl:ml-72' : 'lg:ml-20'}`}>
        <Header currency={currency} setCurrency={setCurrency} toggleSidebar={toggleSidebar} />
        <div className="mt-8 animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
