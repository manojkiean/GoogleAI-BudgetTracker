import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { expenseData, budgetData } from '../../constants';
import type { Currency } from '../../types';
import { ExpenseCategory } from '../../types';
// FIX: Removed `formatCurrency` from this import to resolve a name conflict with the local, chart-specific `formatCurrency` function defined below.
import { convertAmount } from '../../utils/currency';

interface BudgetBarChartProps {
    currency: Currency;
    onCategoryClick: (category: ExpenseCategory) => void;
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-3 border border-gray-600 rounded-md text-white shadow-lg">
                <p className="font-semibold mb-2">{label}</p>
                <p style={{ color: '#82ca9d' }}>{`Budget: ${formatCurrency(payload[0].value, currency)}`}</p>
                <p style={{ color: '#8884d8' }}>{`Actual: ${formatCurrency(payload[1].value, currency)}`}</p>
            </div>
        );
    }
    return null;
};

const BudgetBarChart: React.FC<BudgetBarChartProps> = ({ currency, onCategoryClick }) => {
    const chartData = useMemo(() => {
        const actualSpending = expenseData.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {} as Record<ExpenseCategory, number>);

        return Object.keys(budgetData).map(cat => {
            const category = cat as ExpenseCategory;
            return {
                name: category,
                budget: convertAmount(budgetData[category], 'USD', currency.code),
                actual: convertAmount(actualSpending[category] || 0, 'USD', currency.code),
            }
        });
    }, [currency]);
    
    const handleBarClick = (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const category = data.activePayload[0].payload.name;
            onCategoryClick(category as ExpenseCategory);
        }
    };

  return (
    <div style={{ width: '100%', height: 300 }} role="figure" aria-label="Budget versus actual spending bar chart">
        <ResponsiveContainer>
            <BarChart
                data={chartData}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
                onClick={handleBarClick}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#A0A0A0' }} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency, true)} tick={{ fill: '#A0A0A0' }} />
                <Tooltip content={<CustomTooltip currency={currency} />} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
                <Legend iconType="circle" />
                <Bar dataKey="budget" fill="#82ca9d" radius={[4, 4, 0, 0]} style={{ cursor: 'pointer' }} />
                <Bar dataKey="actual" fill="#8884d8" radius={[4, 4, 0, 0]} style={{ cursor: 'pointer' }} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

// A helper inside this file since it's chart-specific formatting
const formatCurrency = (amount: number, currency: Currency, compact = false): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  }).format(amount);
};

export default BudgetBarChart;