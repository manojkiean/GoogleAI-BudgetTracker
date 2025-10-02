
import React, { useState, useEffect } from 'react';
import { ExpenseSource } from '../types';
import type { Currency, Expense, Account } from '../types';
import { formatCurrency, convertAmount } from '../utils/currency';
import { CalendarIcon, CreditCardIcon } from './icons/IconComponents';
import AddEditExpenseForm from './AddEditExpenseForm';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../utils/api';

interface ExpensesProps {
  currency: Currency;
  filter: ExpenseSource | null;
  onClearFilter: () => void;
}

const categoryColors: Record<ExpenseSource, string> = {
    [ExpenseSource.RENT]: 'border-red-500',
    [ExpenseSource.BILLS]: 'border-blue-500',
    [ExpenseSource.FOOD]: 'border-purple-500',
    [ExpenseSource.TRANSPORTATION]: 'border-yellow-500',
    [ExpenseSource.GADGETS]: 'border-green-500',
    [ExpenseSource.OTHER]: 'border-pink-500',
    [ExpenseSource.PIGGY_POT]: 'border-indigo-500',
    [ExpenseSource.PERSONAL_CARE]: 'border-teal-500',
    [ExpenseSource.BUYING_CAR]: 'border-orange-500',
    [ExpenseSource.HOLIDAYS]: 'border-lime-500',
    [ExpenseSource.NETFLIX]: 'border-rose-500',
    [ExpenseSource.COUNCIL_TAX]: 'border-cyan-500',
    [ExpenseSource.AMAZON_PRIME]: 'border-amber-500',
    [ExpenseSource.INSURANCE]: 'border-emerald-500',
};

const ExpenseCard: React.FC<{ 
    expense: Expense; 
    currency: Currency; 
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
}> = ({ expense, currency, onEdit, onDelete }) => (
    <div className={`bg-gray-800 p-4 rounded-xl shadow-lg border-l-4 ${categoryColors[expense.category]}`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="font-semibold">{expense.item}</p>
                <p className="text-sm text-gray-400">{expense.category}</p>
            </div>
            <p className="font-bold text-red-400 text-lg">
                {formatCurrency(convertAmount(expense.amount, 'USD', currency.code), currency)}
            </p>
        </div>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <div className="flex items-center">
                <CalendarIcon />
                <span className="ml-1">{new Date(expense.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
                <CreditCardIcon />
                <span className="ml-1">{expense.account}</span>
            </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => onEdit(expense)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Edit</button>
            <button onClick={() => onDelete(expense.id)} className="text-sm font-medium text-red-500 hover:text-red-400">Delete</button>
        </div>
    </div>
);

const Expenses: React.FC<ExpensesProps> = ({ currency, filter, onClearFilter }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    useEffect(() => {
        getExpenses().then(setExpenses);
    }, []);

    const handleSaveExpense = (expenseData: Omit<Expense, 'id'> & { id?: number }) => {
        const promise = expenseData.id
            ? updateExpense({ ...expenseData, id: expenseData.id } as Expense)
            : addExpense(expenseData as Omit<Expense, 'id'>);

        promise.then(() => {
            getExpenses().then(setExpenses);
            setIsFormVisible(false);
            setEditingExpense(null);
        });
    };

    const handleDeleteExpense = (id: number) => {
        deleteExpense(id).then(() => {
            setExpenses(expenses.filter(e => e.id !== id));
        });
    };

    const handleEditClick = (expense: Expense) => {
        setEditingExpense(expense);
        setIsFormVisible(true);
    };

    const handleAddClick = () => {
        setEditingExpense(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingExpense(null);
    };

    const filteredExpenses = (filter ? expenses.filter(e => e.category === filter) : expenses)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <section aria-labelledby="expenses-heading">
            <div className="flex justify-between items-center mb-6">
                <h2 id="expenses-heading" className="text-2xl font-bold">Expenses</h2>
                {!isFormVisible && (
                    <button 
                        onClick={handleAddClick}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                        Add Expense
                    </button>
                )}
            </div>

            {isFormVisible && (
                <AddEditExpenseForm 
                    expense={editingExpense}
                    onSave={handleSaveExpense}
                    onCancel={handleCancel}
                />
            )}

            {filter && (
                <div className="bg-gray-700 p-4 rounded-lg my-6 flex justify-between items-center animate-fade-in" role="status">
                    <p className="text-gray-200">
                        Showing results for: <span className="font-semibold text-cyan-400">{filter}</span>
                    </p>
                    <button
                        onClick={onClearFilter}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        Clear Filter
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 mb-24 lg:mb-0">
                {filteredExpenses.map((expense) => (
                    <ExpenseCard 
                        key={expense.id} 
                        expense={expense} 
                        currency={currency} 
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteExpense} 
                    />
                ))}
            </div>
        </section>
    );
};

export default Expenses;
