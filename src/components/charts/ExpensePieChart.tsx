import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { PIE_CHART_COLORS, expenseSourceOptions } from '../../utils/constants';
import type { Currency, Transaction, ExpenseSource } from '../../utils/types';
import { formatCurrency, convertAmount } from '../../utils/currency';

interface ExpensePieChartProps {
    currency: Currency;
    onCategoryClick: (category: ExpenseSource) => void;
    expenses: Transaction[];
}

const CustomTooltip = ({ active, payload, currency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="label text-white">{`${payload[0].name} : ${formatCurrency(payload[0].value, currency)}`}</p>
            </div>
        );
    }
    return null;
};

const ActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-base font-semibold">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ currency, onCategoryClick, expenses }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  
  const dataByCategory = useMemo(() => {
    const spendingByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {} as Record<ExpenseSource, number>);

    return expenseSourceOptions
        .map(option => ({
            name: option.source as ExpenseSource,
            value: convertAmount(spendingByCategory[option.source as unknown as ExpenseSource] || 0, 'USD', currency.code),
        }))
        .filter(item => item.value > 0);
  }, [currency, expenses]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieClick = (data: any) => {
    onCategoryClick(data.name as ExpenseSource);
  };

  return (
    <div style={{ width: '100%', height: 300 }} role="figure" aria-label="Expense breakdown pie chart">
        <ResponsiveContainer>
            <PieChart>
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Legend iconType="circle" />
                <Pie
                    data={dataByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    onClick={handlePieClick}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={() => setActiveIndex(-1)}
                    // FIX: The `@types/recharts` package is outdated and is missing the `activeIndex` prop. Using `@ts-ignore` to suppress the error.
                    // @ts-ignore
                    activeIndex={activeIndex}
                    activeShape={ActiveShape}
                    style={{ cursor: 'pointer' }}
                >
                    {dataByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    )) }
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;