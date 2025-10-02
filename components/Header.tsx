
import React from 'react';
import type { Currency } from '../types';
import { CurrencyIcon, MenuIcon } from './icons/IconComponents';

interface HeaderProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleSidebar: () => void;
}

const currencies: Currency[] = [
  { symbol: '$', code: 'USD' },
  { symbol: '£', code: 'GBP' },
  { symbol: '€', code: 'EUR' },
];

const Header: React.FC<HeaderProps> = ({ currency, setCurrency, toggleSidebar }) => {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = currencies.find(c => c.code === e.target.value);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-gray-400 hover:text-white focus:outline-none">
          <MenuIcon />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Zenith Budget</h1>
      </div>
      <div className="relative">
        <label htmlFor="currency-select" className="sr-only">Select Currency</label>
        <select
          id="currency-select"
          value={currency.code}
          onChange={handleCurrencyChange}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-2.5 appearance-none"
          aria-label="Select currency"
        >
          {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
        </select>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" aria-hidden="true">
          <CurrencyIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
