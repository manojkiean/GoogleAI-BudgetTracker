
import React, { useState } from 'react';
import type { Currency, Bill } from '../types';
import { billData } from '../constants';
import { formatCurrency, convertAmount } from '../utils/currency';
import AddEditBillForm from './AddEditBillForm';

interface BillsProps {
  currency: Currency;
}

const Bills: React.FC<BillsProps> = ({ currency }) => {
    const [bills, setBills] = useState<Bill[]>(billData);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingBill, setEditingBill] = useState<Bill | null>(null);

    const handleSaveBill = (billData: Omit<Bill, 'id'> & { id?: number }) => {
        if (billData.id) {
            setBills(bills.map(b => b.id === billData.id ? { ...b, ...billData, id: b.id } : b));
        } else {
            const newBill: Bill = {
                id: Date.now(),
                ...billData,
            };
            setBills([newBill, ...bills]);
        }
        setIsFormVisible(false);
        setEditingBill(null);
    };

    const handleDeleteBill = (id: number) => {
        setBills(bills.filter(b => b.id !== id));
    };

    const handleEditClick = (bill: Bill) => {
        setEditingBill(bill);
        setIsFormVisible(true);
    };

    const handleAddClick = () => {
        setEditingBill(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingBill(null);
    };

    const handleStatusChange = (id: number) => {
        setBills(bills.map(b => b.id === id ? { ...b, status: b.status === 'Paid' ? 'Pending' : 'Paid' } : b));
    };

  return (
    <section aria-labelledby="bills-heading">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 id="bills-heading" className="text-2xl font-bold mb-2 sm:mb-0">Upcoming Bills</h2>
            {!isFormVisible && (
                <button 
                    onClick={handleAddClick}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
                >
                    Add Bill
                </button>
            )}
        </div>

        {isFormVisible && (
            <AddEditBillForm
                bill={editingBill}
                onSave={handleSaveBill}
                onCancel={handleCancel}
            />
        )}

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto mt-6 mb-24 lg:mb-0">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th scope="col" className="p-4 font-semibold">Bill</th>
              <th scope="col" className="p-4 font-semibold">Due Date</th>
              <th scope="col" className="p-4 font-semibold">Category</th>
              <th scope="col" className="p-4 font-semibold text-right">Amount</th>
              <th scope="col" className="p-4 font-semibold text-center">Status</th>
              <th scope="col" className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={bill.id} className={index < bills.length - 1 ? 'border-b border-gray-700' : ''}>
                <td className="p-4">{bill.name}</td>
                <td className="p-4 text-gray-400">{new Date(bill.dueDate).toLocaleDateString()}</td>
                <td className="p-4 text-gray-400">{bill.category}</td>
                <td className="p-4 font-semibold text-right">{formatCurrency(convertAmount(bill.amount, 'USD', currency.code), currency)}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleStatusChange(bill.id)} className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {bill.status}
                  </button>
                </td>
                 <td className="p-4 text-center space-x-2">
                    <button onClick={() => handleEditClick(bill)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Edit</button>
                    <button onClick={() => handleDeleteBill(bill.id)} className="text-sm font-medium text-red-500 hover:text-red-400">Delete</button>
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
