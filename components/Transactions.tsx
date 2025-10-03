
import React, { useState, useMemo } from 'react';
import { Currency, Transaction, TransactionType } from '../types';
import { expenseSourceOptions, incomeSourceOptions } from '../constants';

interface TransactionsProps {
  currency: Currency;
  transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ currency, transactions }) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'subscription'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filter === 'all' || t.type === filter;
      const categoryMatch = categoryFilter === 'all' || t.category === categoryFilter;
      return typeMatch && categoryMatch;
    });
  }, [transactions, filter, categoryFilter]);

  const categories = useMemo(() => {
    const allCategories = [
      ...incomeSourceOptions.map(o => o.source),
      ...expenseSourceOptions.map(o => o.source)
    ];
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);


  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Transactions</h2>
      
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="type-filter" className="text-sm font-medium text-gray-300">Type:</label>
          <select 
            id="type-filter"
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2"
          >
            <option value="all">All</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
            <option value={TransactionType.SUBSCRIPTION}>Subscription</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-300">Category:</label>
          <select 
            id="category-filter"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg">
          <thead>
            <tr>
              <th className="p-4 text-left text-sm font-medium text-gray-400">ID</th>
              <th className="p-4 text-left text-sm font-medium text-gray-400">Type</th>
              <th className="p-4 text-left text-sm font-medium text-gray-400">Source</th>
              <th className="p-4 text-left text-sm font-medium text-gray-400">Category</th>
              <th className="p-4 text-left text-sm font-medium text-gray-400">Amount</th>
              <th className="p-4 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="p-4 text-left text-sm font-medium text-gray-400">Account</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{transaction.id}</td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{transaction.type}</td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{transaction.source}</td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{transaction.category}</td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{currency.symbol}{transaction.amount.toFixed(2)}</td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{transaction.date}</td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-300">{transaction.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
