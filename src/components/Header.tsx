
import React from 'react';
import { MenuIcon, SettingsIcon, CreditCardIcon } from './icons/IconComponents';
import { Tab, User } from '../utils/types';

interface HeaderProps {
  toggleSidebar: () => void;
  setActiveTab: (tab: Tab) => void;
  currentUser: User | null;
  activeTab: Tab;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, setActiveTab, currentUser, activeTab }) => {

  const handleSettingsClick = () => {
    if (activeTab === Tab.MY_ACCOUNT) {
      setActiveTab(Tab.DASHBOARD);
    } else {
      setActiveTab(Tab.MY_ACCOUNT);
    }
  };

  return (
    <header className="grid grid-cols-3 items-center">
      <div className="flex justify-start">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white focus:outline-none">
          <MenuIcon />
        </button>
      </div>

      <div className="flex items-center justify-center">
        <CreditCardIcon />
        <h1 className="text-xl sm:text-3xl font-bold text-white ml-2">Budget Tracker</h1>
      </div>

      <div className="flex items-center justify-end">
        {currentUser && <span className="text-white mr-4 hidden sm:block">Welcome, {currentUser.name}</span>}
        <button onClick={handleSettingsClick} className="text-gray-400 hover:text-white focus:outline-none">
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
