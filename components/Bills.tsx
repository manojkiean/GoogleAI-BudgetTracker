import React from 'react';
import type { Currency } from '../types';
import { billData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';

interface BillsProps {
  currency: Currency;
}

const Bills: React.FC<BillsProps> = ({ currency }) => {
  return (
    <section aria-labelledby="bills-heading">
      <h2 id="bills-heading" className="text-2xl font-bold mb-6">Upcoming Bills</h2>
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto mb-24 lg:mb-0">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th scope="col" className="p-4 font-semibold">Bill</th>
              <th scope="col" className="p-4 font-semibold">Due Date</th>
              <th scope="col" className="p-4 font-semibold">Category</th>
              <th scope="col" className="p-4 font-semibold text-right">Amount</th>
              <th scope="col" className="p-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {billData.map((bill, index) => (
              <tr key={bill.id} className={index < billData.length - 1 ? 'border-b border-gray-700' : ''}>
                <td className="p-4">{bill.name}</td>
                <td className="p-4 text-gray-400">{bill.dueDate}</td>
                <td className="p-4 text-gray-400">{bill.category}</td>
                <td className="p-4 font-semibold text-right">{formatCurrency(convertAmount(bill.amount, 'USD', currency.code), currency)}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Bills;
