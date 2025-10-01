import React from 'react';
import type { Currency } from '../types';
import { subscriptionData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';

interface SubscriptionsProps {
  currency: Currency;
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ currency }) => {
    const totalMonthlyCost = subscriptionData
        .filter(sub => sub.status === 'Active')
        .reduce((acc, sub) => {
            const monthlyAmount = sub.frequency === 'Yearly' ? sub.amount / 12 : sub.amount;
            return acc + convertAmount(monthlyAmount, 'USD', currency.code);
        }, 0);

  return (
    <section aria-labelledby="subscriptions-heading">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 id="subscriptions-heading" className="text-2xl font-bold mb-2 sm:mb-0">Subscriptions</h2>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-400">Total Monthly Cost</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(totalMonthlyCost, currency)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-24 lg:mb-0">
        {subscriptionData.map((sub) => (
          <div key={sub.id} className="bg-gray-800 p-5 rounded-xl shadow-lg flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{sub.service}</p>
              <p className="text-sm text-gray-400">Next payment: {sub.nextPayment}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${sub.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {sub.status}
              </span>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold">
                    {formatCurrency(convertAmount(sub.amount, 'USD', currency.code), currency)}
                </p>
                <p className="text-sm text-gray-400">/{sub.frequency === 'Monthly' ? 'Mo' : 'Yr'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Subscriptions;
