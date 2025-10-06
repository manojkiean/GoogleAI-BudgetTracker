
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { formatDate } from '../utils/date';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  type: TransactionType;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, type }) => {
  const filteredTransactions = transactions.filter(t => t && t.type === type);
  const isSubscription = type === TransactionType.SUBSCRIPTION;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{type.charAt(0).toUpperCase() + type.slice(1)}s</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              {isSubscription && (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Frequency</th>
                </>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account</th>
              {isSubscription && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Next Payment</th>
              )}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{transaction.source}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.amount}</td>
                {isSubscription && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.subscriptionType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.frequency}</td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(transaction.date, 'DD-MM-YYYY')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.account}</td>
                {isSubscription && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.nextPayment ? formatDate(transaction.nextPayment, 'DD-MM-YYYY') : 'N/A'}</td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(transaction)} className="text-indigo-400 hover:text-indigo-600 mr-4">Edit</button>
                  <button onClick={() => onDelete(transaction.id)} className="text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
