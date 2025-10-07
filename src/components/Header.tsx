
import React from 'react';
import { MenuIcon, SettingsIcon, CreditCardIcon } from './icons/IconComponents';
import { Tab, User } from '../utils/types';

interface HeaderProps {
  toggleSidebar: () => void;
  setActiveTab: (tab: Tab) => void;
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, setActiveTab, currentUser }) => {

  return (
    <header className="relative flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-gray-400 hover:text-white focus:outline-none">
          <MenuIcon />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <CreditCardIcon />
        <h1 className="text-2xl sm:text-3xl font-bold text-white ml-2">Budget Tracker</h1>
      </div>

      <div className="flex items-center">
        {currentUser && <span className="text-white mr-4">Welcome, {currentUser.name}</span>}
        <button onClick={() => setActiveTab(Tab.MY_ACCOUNT)} className="text-gray-400 hover:text-white focus:outline-none">
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
