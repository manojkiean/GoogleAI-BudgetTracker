
import React, { useState, useEffect } from 'react';
import { Bill, ExpenseSource } from '../types';

interface AddEditBillFormProps {
  bill?: Bill | null;
  onSave: (bill: Omit<Bill, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

const AddEditBillForm: React.FC<AddEditBillFormProps> = ({ bill, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseSource>(ExpenseSource.BILLS);

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setAmount(String(bill.amount));
      setDueDate(new Date(bill.dueDate).toISOString().split('T')[0]);
      setCategory(bill.category as ExpenseSource);
    }
  }, [bill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || isNaN(parseFloat(amount))) return;
    onSave({
      id: bill?.id,
      name,
      amount: parseFloat(amount),
      dueDate,
      category,
      status: bill?.status || 'Pending',
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{bill ? 'Edit Bill' : 'Add Bill'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Bill Name</label>
                <input 
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder='e.g., Electricity'
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
                    placeholder='100'
                    required
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input 
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onFocus={(e) => (e.currentTarget as any).showPicker()}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    required
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select 
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseSource)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                    {Object.values(ExpenseSource).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
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
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            {bill ? 'Save Changes' : 'Add Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditBillForm;
