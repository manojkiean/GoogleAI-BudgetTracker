
import React, { useState, useEffect, useMemo } from 'react';
import { Account } from '../types';
import type { Currency, AccountDetails, Income, Expense } from '../types';
import { formatCurrency, convertAmount } from '../utils/currency';
import { getAccounts, getIncomes, getExpenses } from '../utils/api';

interface AccountsProps {
  currency: Currency;
}

const Accounts: React.FC<AccountsProps> = ({ currency }) => {
    const [accounts, setAccounts] = useState<AccountDetails[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        getAccounts().then(accountsData => {
            const correctedAccounts = accountsData.map(account => {
                if (account.name === Account.HSBC) {
                    return { ...account, balance: 5000 };
                }
                if (account.name === Account.PAYPAL) {
                    return { ...account, balance: 1500 };
                }
                return account;
            });
            setAccounts(correctedAccounts);
        });
        getIncomes().then(setIncomes);
        getExpenses().then(setExpenses);
    }, []);

    const totalBalance = useMemo(() => accounts.reduce((acc, account) => acc + convertAmount(account.balance, 'USD', currency.code), 0), [accounts, currency.code]);

    const accountSummary: Record<string, { income: number; expense: number }> = useMemo(() => {
        const summary: Record<string, { income: number, expense: number }> = {};

        Object.values(Account).forEach(accountName => {
            summary[accountName] = {
                income: 0,
                expense: 0,
            };
        });

        incomes.forEach(income => {
            const accountName = income.account as string;
            if (summary[accountName]) {
                summary[accountName].income += convertAmount(income.amount, 'USD', currency.code);
            }
        });

        expenses.forEach(expense => {
            const accountName = expense.account as string;
            if (summary[accountName]) {
                summary[accountName].expense += convertAmount(expense.amount, 'USD', currency.code);
            }
        });

        return summary;
    }, [incomes, expenses, currency.code]);

    const filteredAccountSummary = Object.entries(accountSummary).filter(
        ([, data]) => data.income !== 0 || data.expense !== 0
    );

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
            {accounts.map((account) => (
              <div key={account.id} className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-br ${account.gradient} flex flex-col justify-between h-full`}>
                <div>
                    <p className="text-xl font-semibold">{account.name}</p>
                </div>
                <p className="text-3xl font-bold mt-4 self-end">
                  {formatCurrency(convertAmount(account.balance, 'USD', currency.code), currency)}
                </p>
              </div>
            ))}
        </div>
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-white">Account Summary</h3>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {filteredAccountSummary.map(([accountName, data]) => (
                    <div key={accountName} className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-300 font-medium mb-2">{accountName}</p>
                        <div className="flex justify-between items-center">
                          <div>
                              <p className="font-semibold text-green-400">Income: {formatCurrency(data.income, currency)}</p>
                              <p className="font-semibold text-red-400">Expense: {formatCurrency(data.expense, currency)}</p>
                          </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Accounts;
