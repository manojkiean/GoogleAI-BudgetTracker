
import React, { useState, useEffect } from 'react';
import { Transaction, Account, ExpenseSource, Goal, TransactionType } from '../types';
import { expenseSourceOptions } from '../constants';
import TransactionList from './TransactionList';

interface AddEditSubscriptionFormProps {
  subscription?: Transaction | null;
  transactions: Transaction[];
  onSave: (subscription: Omit<Transaction, 'id'> & { id?: number }) => Promise<boolean>;
  onCancel: () => void;
  onDelete: (id: number) => void;
  onEdit: (subscription: Transaction) => void;
}

const subscriptionSourceOptions = expenseSourceOptions.filter(s => s.goal === Goal.SUBSCRIPTIONS);

const AddEditSubscriptionForm: React.FC<AddEditSubscriptionFormProps> = ({ subscription, transactions, onSave, onCancel, onDelete, onEdit }) => {
  const [source, setSource] = useState<ExpenseSource | ''>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<Account>(Account.HSBC);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [subscriptionTransactions, setSubscriptionTransactions] = useState<Transaction[]>([]);

  const resetForm = () => {
    setSource(subscriptionSourceOptions.length > 0 ? subscriptionSourceOptions[0].source : '');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setAccount(Account.HSBC);
  };

  useEffect(() => {
    if (subscription) {
      setSource(subscription.source as ExpenseSource);
      setAmount(String(subscription.amount));
      setDate(new Date(subscription.date).toISOString().split('T')[0]);
      setAccount(subscription.account as Account);
    } else {
      resetForm();
    }
    // Clear message when the form is reset or a new item is being edited
    setMessage(null);
  }, [subscription]);

  useEffect(() => {
    setSubscriptionTransactions(transactions.filter(t => t.type === TransactionType.SUBSCRIPTION));
  }, [transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount || isNaN(parseFloat(amount))) return;
    
    const success = await onSave({
      id: subscription?.id,
      source,
      amount: parseFloat(amount),
      date,
      account,
      category: source as ExpenseSource,
      type: TransactionType.SUBSCRIPTION,
    });

    if (success) {
      setMessage({ text: 'Subscription saved successfully!', type: 'success' });
      if (!subscription) {
        resetForm(); // Reset form only when adding a new item
      }
    } else {
      setMessage({ text: 'Failed to save subscription.', type: 'error' });
    }
  };

  const handleCancel = () => {
    setMessage(null);
    onCancel();
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">{subscription ? 'Edit Subscription' : 'Add Subscription'}</h3>
        {message && (
            <div className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {message.text}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-2">Subscription Item</label>
                    <select 
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value as ExpenseSource)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    >
                        {subscriptionSourceOptions.map(s => <option key={s.source} value={s.source}>{s.source}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <input 
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        placeholder='10'
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input 
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-300 mb-2">Account</label>
                    <select 
                        id="account"
                        value={account}
                        onChange={(e) => setAccount(e.target.value as Account)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    >
                        {Object.values(Account).map(acc => <option key={acc} value={acc}>{acc}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-4 pt-2">
            <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
                {subscription ? 'Save Changes' : 'Add Subscription'}
            </button>
            </div>
        </form>
        </div>
        <TransactionList transactions={subscriptionTransactions} onEdit={onEdit} onDelete={onDelete} type={TransactionType.SUBSCRIPTION} />
    </>
  );
};

export default AddEditSubscriptionForm;
