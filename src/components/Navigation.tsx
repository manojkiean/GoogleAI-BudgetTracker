
import React from 'react';
import { Tab } from '../utils/types';
import { DashboardIcon, ExpensesIcon, GoalIcon, AccountsIcon, TodoIcon, MyAccountIcon, CalcIcon, ReportsIcon, IncomeIcon, SubscriptionsIcon, AddIcon } from './icons/IconComponents';
import Tooltip from './Tooltip';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  sidebarOpen: boolean;
}

interface NavItemType {
  tab: Tab;
  icon: React.ReactNode;
}

interface NavGroup {
    title: string;
    items: NavItemType[];
}

const navGroups: NavGroup[] = [
    {
        title: 'Overview',
        items: [
            { tab: Tab.DASHBOARD, icon: <DashboardIcon /> },
        ]
    },
    {
        title: 'Finances',
        items: [
            { tab: Tab.ACCOUNTS, icon: <AccountsIcon /> },
            { tab: Tab.INCOME, icon: <IncomeIcon /> },
            { tab: Tab.EXPENSE, icon: <ExpensesIcon /> },
            { tab: Tab.SUBSCRIPTION, icon: <SubscriptionsIcon /> },
            { tab: Tab.TRANSACTIONS, icon: <ExpensesIcon /> },
        ]
    },
    {
        title: 'Planning',
        items: [
            { tab: Tab.GOALSETTINGS, icon: <GoalIcon /> },
            { tab: Tab.ADD_GOAL_DEPOSIT, icon: <AddIcon /> },
            { tab: Tab.TODO, icon: <TodoIcon /> },
        ]
    },
    {
        title: 'Reporting',
        items: [
            { tab: Tab.REPORTS, icon: <ReportsIcon /> },
        ]
    },
    {
        title: 'Settings',
        items: [
            { tab: Tab.MY_ACCOUNT, icon: <MyAccountIcon /> },
        ]
    }
];

// Flattened for mobile view
const navItems: NavItemType[] = navGroups.flatMap(g => g.items);

const NavItem: React.FC<{
    item: NavItemType;
    isActive: boolean;
    onClick: () => void;
    sidebarOpen: boolean;
}> = ({ item, isActive, onClick, sidebarOpen }) => {
    const navButton = (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            } ${!sidebarOpen ? 'justify-center' : ''}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {item.icon}
            {sidebarOpen && <span className="ml-4 font-medium">{item.tab}</span>}
        </button>
    );

    return sidebarOpen ? navButton : <Tooltip text={item.tab}>{navButton}</Tooltip>;
};

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, sidebarOpen }) => {
  return (
    <>
      {/* Sidebar for large screens */}
      <aside className={`hidden lg:flex flex-col bg-gray-800 p-4 fixed h-full transition-width duration-300 ${sidebarOpen ? 'w-64 xl:w-72' : 'w-20'}`}>
        <div className={`text-2xl font-bold text-white mb-10 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} pl-2'}`}>
            <CalcIcon />
            {sidebarOpen && <span className="ml-2">Budget Tracker</span>}
        </div>
        <nav className="flex flex-col space-y-2" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.title}>
                {sidebarOpen && <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.title}</h3>}
                {group.items.map((item) => (
                    <NavItem
                        key={item.tab}
                        item={item}
                        isActive={activeTab === item.tab}
                        onClick={() => setActiveTab(item.tab)}
                        sidebarOpen={sidebarOpen}
                    />
                ))}
            </div>
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
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
