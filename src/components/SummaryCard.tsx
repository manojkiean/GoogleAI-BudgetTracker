import React from 'react';
import { formatCurrency } from '../utils/currency';
import type { Currency } from '../utils/types';

interface SummaryCardProps {
  title: string;
  amount: number;
  currency: Currency;
  icon: React.ReactNode;
  trend: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, currency, icon, trend }) => {
    const isPositiveTrend = trend.startsWith('+');

  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">{title}</p>
        <div className="text-cyan-400">{icon}</div>
      </div>
      <div>
        <h3 className="text-3xl font-bold mt-2">
            {formatCurrency(amount, currency)}
        </h3>
        <p className={`text-sm mt-1 ${isPositiveTrend ? 'text-green-400' : 'text-red-400'}`}>{trend}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
