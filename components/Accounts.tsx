
import React, { useMemo } from 'react';
import { Transaction, Currency, AccountDetails } from '../types';
import { convertAmount } from '../utils/currency';

interface AccountsProps {
    transactions: Transaction[];
    currency: Currency;
    accounts: AccountDetails[];
}

const Accounts: React.FC<AccountsProps> = ({ transactions, currency, accounts }) => {
    const summarizedAccounts = useMemo(() => {
        const summaryByAccount = transactions.reduce((acc, transaction) => {
            const { account, type, amount } = transaction;

            if (!acc[account]) {
                acc[account] = { income: 0, expense: 0 };
            }

            const convertedAmount = convertAmount(amount, 'USD', currency.code);

            if (type === 'income') {
                acc[account].income += convertedAmount;
            } else {
                acc[account].expense += convertedAmount;
            }

            return acc;
        }, {} as Record<string, { income: number; expense: number }>);

        return Object.keys(summaryByAccount)
            .map(accountName => ({
                name: accountName,
                income: summaryByAccount[accountName].income,
                expense: summaryByAccount[accountName].expense,
            }))
            .filter(account => account.income !== 0 || account.expense !== 0);

    }, [transactions, currency.code]);

    const gradients = [
        'from-cyan-500 to-blue-500',
        'from-green-400 to-teal-500',
        'from-purple-500 to-indigo-500',
        'from-pink-500 to-rose-500',
        'from-amber-500 to-orange-600',
    ];

    return (
        <div className="p-4 md:p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Accounts Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summarizedAccounts.map((account, index) => (
                    <div key={account.name} className={`p-4 rounded-lg shadow-lg bg-gradient-to-br ${gradients[index % gradients.length]}`}>
                        <h3 className="font-bold text-lg mb-2 text-white">{account.name}</h3>
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-white/80 text-sm">Income</span>
                           <span className="font-semibold text-green-300">{currency.symbol}{account.income.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/80 text-sm">Expense</span>
                           <span className="font-semibold text-red-300">{currency.symbol}{account.expense.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accounts;
