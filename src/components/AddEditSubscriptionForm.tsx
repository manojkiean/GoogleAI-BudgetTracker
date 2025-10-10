
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Account, ExpenseSource, Goal, TransactionType } from '../utils/types';
import { expenseSourceOptions } from '../utils/constants';
import TransactionList from './TransactionList';
import { formatDate } from '../utils/date';

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
  const [category, setCategory] = useState<ExpenseSource | ''>(subscriptionSourceOptions.length > 0 ? subscriptionSourceOptions[0].source : '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<Account>(Account.HSBC);
  const [subscriptionType, setSubscriptionType] = useState<'Recurring' | 'One Off'>('Recurring');
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [nextPayment, setNextPayment] = useState('');
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const resetForm = () => {
    setCategory(subscriptionSourceOptions.length > 0 ? subscriptionSourceOptions[0].source : '');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setAccount(Account.HSBC);
    setSubscriptionType('Recurring');
    setFrequency('Monthly');
    setNextPayment('');
  };

  const calculateNextPayment = (startDate: string, frequency: 'Weekly' | 'Monthly' | 'Yearly'): string => {
    const date = new Date(startDate);
    if (frequency === 'Weekly') {
      date.setDate(date.getDate() + 7);
    } else if (frequency === 'Monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (frequency === 'Yearly') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (subscription) {
      setCategory(subscription.category as ExpenseSource);
      setAmount(String(subscription.amount));
      setDate(formatDate(subscription.date, 'YYYY-MM-DD'));
      setAccount(subscription.account as Account);
      setSubscriptionType(subscription.subscriptionType || 'Recurring');
      setFrequency(subscription.frequency || 'Monthly');
      setNextPayment(subscription.nextPayment ? formatDate(subscription.nextPayment, 'YYYY-MM-DD') : '');
    } else {
      resetForm();
    }
  }, [subscription]);

  useEffect(() => {
    if (subscriptionType === 'Recurring' && date) {
      const calculatedNextPayment = calculateNextPayment(date, frequency);
      setNextPayment(calculatedNextPayment);
    } else {
      setNextPayment('');
    }
  }, [date, frequency, subscriptionType]);

  const subscriptionTransactions = useMemo(() => {
    return transactions.filter(t => t.type === TransactionType.SUBSCRIPTION);
  }, [transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || isNaN(parseFloat(amount))) return;
    
    const success = await onSave({
      id: subscription?.id,
      source: category,
      amount: parseFloat(amount),
      date,
      account,
      category,
      type: TransactionType.SUBSCRIPTION,
      subscriptionType,
      frequency,
      nextPayment: nextPayment || undefined,
    });

    if (success) {
      setMessage({ text: 'Subscription saved successfully!', type: 'success' });
      if (!subscription) {
        resetForm();
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
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">{subscription ? 'Edit Subscription' : 'Add Subscription'}</h3>
        {message && (
            <div className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {message.text}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select 
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseSource)}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-300 mb-2">Subscription Type</label>
                    <select 
                        id="subscriptionType"
                        value={subscriptionType}
                        onChange={(e) => setSubscriptionType(e.target.value as 'Recurring' | 'One Off')}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    >
                        <option value="Recurring">Recurring</option>
                        <option value="One Off">One Off</option>
                    </select>
                </div>
                {subscriptionType === 'Recurring' && (
                        <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                            <select 
                                id="frequency"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as 'Weekly' | 'Monthly' | 'Yearly')}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            >
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                )}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Payment Date</label>
                    <input 
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {subscriptionType === 'Recurring' && (
                        <div>
                            <label htmlFor="nextPayment" className="block text-sm font-medium text-gray-300 mb-2">Next Payment</label>
                            <input
                                type="date"
                                id="nextPayment"
                                value={nextPayment}
                                readOnly
                                className="bg-gray-900 border border-gray-700 text-gray-400 text-sm rounded-lg block w-full p-2.5"
                            />
                        </div>
                )}
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
