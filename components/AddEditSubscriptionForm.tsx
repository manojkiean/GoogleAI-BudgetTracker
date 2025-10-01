
import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';

interface AddEditSubscriptionFormProps {
  subscription?: Subscription | null;
  onSave: (subscription: Omit<Subscription, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

const AddEditSubscriptionForm: React.FC<AddEditSubscriptionFormProps> = ({ subscription, onSave, onCancel }) => {
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [nextPayment, setNextPayment] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (subscription) {
      setService(subscription.service);
      setAmount(String(subscription.amount));
      setFrequency(subscription.frequency);
      setNextPayment(new Date(subscription.nextPayment).toISOString().split('T')[0]);
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !amount || isNaN(parseFloat(amount))) return;
    onSave({
      id: subscription?.id,
      service,
      amount: parseFloat(amount),
      frequency,
      nextPayment,
      status: subscription?.status || 'Active',
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{subscription ? 'Edit Subscription' : 'Add Subscription'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">Service</label>
                <input 
                    type="text"
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder='e.g., Netflix'
                    required
                />
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input 
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder='9.99'
                    required
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                <select 
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as 'Monthly' | 'Yearly')}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </div>
            <div>
                <label htmlFor="nextPayment" className="block text-sm font-medium text-gray-300 mb-2">Next Payment</label>
                <input 
                    type="date"
                    id="nextPayment"
                    value={nextPayment}
                    onChange={(e) => setNextPayment(e.target.value)}
                    onFocus={(e) => (e.currentTarget as any).showPicker()}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    required
                />
            </div>
        </div>
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            {subscription ? 'Save Changes' : 'Add Subscription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditSubscriptionForm;
