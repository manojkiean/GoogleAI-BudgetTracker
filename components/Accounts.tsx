import React from 'react';
import type { Currency } from '../types';
import { accountData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';

interface AccountsProps {
  currency: Currency;
}

const Accounts: React.FC<AccountsProps> = ({ currency }) => {
    const totalBalance = accountData.reduce((acc, account) => acc + convertAmount(account.balance, 'USD', currency.code), 0);

  return (
    <section aria-labelledby="accounts-heading">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 id="accounts-heading" className="text-2xl font-bold mb-2 sm:mb-0">Accounts Overview</h2>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-xl font-semibold text-white">{formatCurrency(totalBalance, currency)}</p>
            </div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-24 lg:mb-0">
        {accountData.map((account) => (
          <div key={account.id} className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-br ${account.gradient} flex flex-col justify-between`}>
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
    </section>
  );
};

export default Accounts;
