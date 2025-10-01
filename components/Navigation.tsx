import React from 'react';
import { Tab } from '../types';
import { DashboardIcon, IncomeIcon, ExpensesIcon, SubscriptionsIcon, BillsIcon, AccountsIcon, TodoIcon } from './icons/IconComponents';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const navItems: { tab: Tab; icon: React.ReactNode }[] = [
  { tab: Tab.DASHBOARD, icon: <DashboardIcon /> },
  { tab: Tab.INCOME, icon: <IncomeIcon /> },
  { tab: Tab.EXPENSES, icon: <ExpensesIcon /> },
  { tab: Tab.SUBSCRIPTIONS, icon: <SubscriptionsIcon /> },
  { tab: Tab.BILLS, icon: <BillsIcon /> },
  { tab: Tab.ACCOUNTS, icon: <AccountsIcon /> },
  { tab: Tab.TODO, icon: <TodoIcon /> },
];

const NavItem: React.FC<{
    item: { tab: Tab; icon: React.ReactNode };
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {item.icon}
        <span className="ml-4 font-medium hidden lg:inline">{item.tab}</span>
    </button>
);

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-gray-800 p-4 fixed h-full">
        <div className="text-2xl font-bold text-white mb-10 flex items-center justify-center">
            Zenith
        </div>
        <nav className="flex flex-col space-y-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavItem 
              key={item.tab}
              item={item}
              isActive={activeTab === item.tab}
              onClick={() => setActiveTab(item.tab)}
            />
          ))}
        </nav>
      </aside>

      {/* Bottom Nav for mobile screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around p-2 z-50" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-md transition-colors duration-200 ${
              activeTab === item.tab ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
            }`}
            aria-label={item.tab}
            aria-current={activeTab === item.tab ? 'page' : undefined}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.tab.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
