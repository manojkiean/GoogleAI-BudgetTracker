
import React, { useState, useEffect } from 'react';
import type { Currency, Subscription } from '../types';
import { formatCurrency, convertAmount } from '../utils/currency';
import AddEditSubscriptionForm from './AddEditSubscriptionForm';
import { getSubscriptions, addSubscription, updateSubscription, deleteSubscription } from '../utils/api';

interface SubscriptionsProps {
  currency: Currency;
}

const SubscriptionCard: React.FC<{ 
    subscription: Subscription; 
    currency: Currency; 
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: number) => void;
}> = ({ subscription, currency, onEdit, onDelete }) => (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg font-semibold">{subscription.service}</p>
                <p className="text-sm text-gray-400">Next payment: {new Date(subscription.nextPayment).toLocaleDateString()}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${subscription.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {subscription.status}
                </span>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold">
                    {formatCurrency(convertAmount(subscription.amount, 'USD', currency.code), currency)}
                </p>
                <p className="text-sm text-gray-400">/{subscription.frequency === 'Monthly' ? 'Mo' : 'Yr'}</p>
            </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => onEdit(subscription)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Edit</button>
            <button onClick={() => onDelete(subscription.id)} className="text-sm font-medium text-red-500 hover:text-red-400">Delete</button>
        </div>
    </div>
);

const Subscriptions: React.FC<SubscriptionsProps> = ({ currency }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        getSubscriptions().then(setSubscriptions);
    }, []);

    const totalMonthlyCost = subscriptions
        .filter(sub => sub.status === 'Active')
        .reduce((acc, sub) => {
            const monthlyAmount = sub.frequency === 'Yearly' ? sub.amount / 12 : sub.amount;
            return acc + convertAmount(monthlyAmount, 'USD', currency.code);
        }, 0);

    const handleSaveSubscription = (subscriptionData: Omit<Subscription, 'id'> & { id?: number }) => {
        const promise = subscriptionData.id
            ? updateSubscription({ ...subscriptionData, id: subscriptionData.id } as Subscription)
            : addSubscription(subscriptionData as Omit<Subscription, 'id'>);

        promise.then(() => {
            getSubscriptions().then(setSubscriptions);
            setIsFormVisible(false);
            setEditingSubscription(null);
        });
    };

    const handleDeleteSubscription = (id: number) => {
        deleteSubscription(id).then(() => {
            setSubscriptions(subscriptions.filter(s => s.id !== id));
        });
    };

    const handleEditClick = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsFormVisible(true);
    };

    const handleAddClick = () => {
        setEditingSubscription(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingSubscription(null);
    };

  return (
    <section aria-labelledby="subscriptions-heading">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 id="subscriptions-heading" className="text-2xl font-bold mb-2 sm:mb-0">Subscriptions</h2>
            <div className="flex items-center space-x-4">
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Total Monthly Cost</p>
                    <p className="text-xl font-semibold text-white">{formatCurrency(totalMonthlyCost, currency)}</p>
                </div>
                {!isFormVisible && (
                    <button 
                        onClick={handleAddClick}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                        Add Subscription
                    </button>
                )}
            </div>
        </div>

        {isFormVisible && (
            <AddEditSubscriptionForm 
                subscription={editingSubscription}
                onSave={handleSaveSubscription}
                onCancel={handleCancel}
            />
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 mb-24 lg:mb-0">
        {subscriptions.map((sub) => (
          <SubscriptionCard 
            key={sub.id} 
            subscription={sub} 
            currency={currency} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteSubscription} 
            />
        ))}
      </div>
    </section>
  );
};

export default Subscriptions;
