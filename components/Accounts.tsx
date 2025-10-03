
import React, { useMemo } from 'react';
import { Transaction, AccountDetails, Currency } from '../types';
import { convertAmount } from '../utils/currency';

interface AccountsProps {
    transactions: Transaction[];
    accounts: AccountDetails[];
    currency: Currency;
}

const Accounts: React.FC<AccountsProps> = ({ transactions, accounts, currency }) => {
    const summarizedAccounts = useMemo(() => {
        // 1. As you suggested, group transactions by account and sum the amounts.
        const summaryByAccount = transactions.reduce((acc, transaction) => {
            const { account_id, type, amount } = transaction;

            if (!acc[account_id]) {
                acc[account_id] = { income: 0, expense: 0 };
            }

            const convertedAmount = convertAmount(amount, 'USD', currency.code);

            if (type === 'income') {
                acc[account_id].income += convertedAmount;
            } else {
                acc[account_id].expense += convertedAmount;
            }

            return acc;
        }, {} as Record<number, { income: number; expense: number }>);

        // 2. Map the summarized data to the account details for display.
        return accounts
            .map(account => {
                const summary = summaryByAccount[account.id];
                return {
                    ...account,
                    income: summary ? summary.income : 0,
                    expense: summary ? summary.expense : 0,
                };
            })
            .filter(account => account.income !== 0 || account.expense !== 0);

    }, [transactions, accounts, currency.code]);

    return (
        <div className="p-4 md:p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Accounts Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summarizedAccounts.map(account => (
                    // The `key` prop is essential in React for list rendering.
                    <div key={account.id} className="p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">{account.name}</h3>
                        <div className="text-green-400">Income: {currency.symbol}{account.income.toFixed(2)}</div>
                        <div className="text-red-400">Expense: {currency.symbol}{account.expense.toFixed(2)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accounts;
