
import React from 'react';
import type { Currency } from '../types';
import { accountData, incomeData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';

interface AccountsProps {
  currency: Currency;
}

const Accounts: React.FC<AccountsProps> = ({ currency }) => {
    const totalBalance = accountData.reduce((acc, account) => acc + convertAmount(account.balance, 'USD', currency.code), 0);

    const incomeByCategory = incomeData.reduce((acc, income) => {
        const category = income.category;
        const amount = convertAmount(income.amount, 'USD', currency.code);
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {} as Record<string, number>);

  return (
    <section aria-labelledby="accounts-heading">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 id="accounts-heading" className="text-2xl font-bold mb-2 sm:mb-0">Accounts Overview</h2>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-xl font-semibold text-white">{formatCurrency(totalBalance, currency)}</p>
            </div>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24 lg:mb-0">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountData.map((account) => (
              <div key={account.id} className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-br ${account.gradient} flex flex-col justify-between h-full`}>
                <div>
                    <p className="text-sm opacity-80">{account.type}</p>
                    <p className="text-xl font-semibold">{account.name}</p>
                </div>
                <p className="text-3xl font-bold mt-4 self-end">
                  {formatCurrency(convertAmount(account.balance, 'USD', currency.code), currency)}
                </p>
              </div>
            ))}
        </div>
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-white">Income by Category</h3>
            <div className="space-y-4 flex-grow">
                {Object.entries(incomeByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-300 font-medium">{category}</span>
                        <span className="font-semibold text-green-400">{formatCurrency(amount, currency)}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Accounts;
