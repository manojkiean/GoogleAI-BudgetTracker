
import React, { useState, useEffect } from 'react';
import type { Currency, Income } from '../types';
import { formatCurrency, convertAmount } from '../utils/currency';
import { CalendarIcon, CreditCardIcon } from './icons/IconComponents';
import AddEditIncomeForm from './AddEditIncomeForm';
import { getIncomes, addIncome, updateIncome, deleteIncome } from '../utils/api';

interface IncomeProps {
  currency: Currency;
}

const IncomeCard: React.FC<{ 
    income: Income; 
    currency: Currency;
    onEdit: (income: Income) => void;
    onDelete: (id: number) => void;
}> = ({ income, currency, onEdit, onDelete }) => (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg font-semibold">{income.source}</p>
                <p className="text-sm text-gray-400 bg-gray-700 inline-block px-2 py-1 rounded-md mt-1">{income.category}</p>
            </div>
            <p className="text-xl font-bold text-green-400">
                {formatCurrency(convertAmount(income.amount, 'USD', currency.code), currency)}
            </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm text-gray-400">
            <div className="flex items-center">
                <CalendarIcon />
                <span className="ml-2">{new Date(income.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
                <CreditCardIcon />
                <span className="ml-2">{income.account}</span>
            </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => onEdit(income)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Edit</button>
            <button onClick={() => onDelete(income.id)} className="text-sm font-medium text-red-500 hover:text-red-400">Delete</button>
        </div>
    </div>
);

const Income: React.FC<IncomeProps> = ({ currency }) => {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);

    useEffect(() => {
        getIncomes().then(setIncomes);
    }, []);

    const handleSaveIncome = (incomeData: Omit<Income, 'id'> & { id?: number }) => {
        const promise = incomeData.id
            ? updateIncome({ ...incomeData, id: incomeData.id } as Income)
            : addIncome(incomeData as Omit<Income, 'id'>);

        promise.then(() => {
            getIncomes().then(setIncomes);
            setIsFormVisible(false);
            setEditingIncome(null);
        });
    };

    const handleDeleteIncome = (id: number) => {
        deleteIncome(id).then(() => {
            setIncomes(incomes.filter(i => i.id !== id));
        });
    };

    const handleEditClick = (income: Income) => {
        setEditingIncome(income);
        setIsFormVisible(true);
    };

    const handleAddClick = () => {
        setEditingIncome(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingIncome(null);
    };

    return (
        <section aria-labelledby="income-heading">
            <div className="flex justify-between items-center mb-6">
                <h2 id="income-heading" className="text-2xl font-bold">Income</h2>
                {!isFormVisible && (
                    <button 
                        onClick={handleAddClick}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                        Add Income
                    </button>
                )}
            </div>

            {isFormVisible && (
                <AddEditIncomeForm 
                    income={editingIncome}
                    onSave={handleSaveIncome}
                    onCancel={handleCancel}
                />
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 mb-24 lg:mb-0">
                {incomes.map((income) => (
                    <IncomeCard 
                        key={income.id} 
                        income={income} 
                        currency={currency} 
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteIncome}
                    />
                ))}
            </div>
        </section>
    );
};

export default Income;
