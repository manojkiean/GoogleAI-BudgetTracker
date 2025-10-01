import React from 'react';
import type { Currency } from '../types';
import { incomeData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';
import { CalendarIcon, CreditCardIcon } from './icons/IconComponents';

interface IncomeProps {
  currency: Currency;
}

const Income: React.FC<IncomeProps> = ({ currency }) => {
  return (
    <section aria-labelledby="income-heading">
      <h2 id="income-heading" className="text-2xl font-bold mb-6">Income</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24 lg:mb-0">
        {incomeData.map((income) => (
          <div key={income.id} className="bg-gray-800 p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold">{income.source}</p>
                <p className="text-sm text-gray-400 bg-gray-700 inline-block px-2 py-1 rounded-md mt-1">{income.category}</p>
              </div>
              <p className="text-xl font-bold text-green-400">
                {formatCurrency(convertAmount(income.amount, 'USD', currency.code), currency)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <CalendarIcon />
                <span className="ml-2">{income.date}</span>
              </div>
              <div className="flex items-center">
                <CreditCardIcon />
                <span className="ml-2">{income.account}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Income;
