import React, { useState, useEffect } from 'react';
import mockData from '../mock-data.json';
import { Currency } from '../types';

interface ReportsProps {
  currency: Currency;
}

const Reports: React.FC<ReportsProps> = ({ currency }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    let data: any[] = [];
    if (selectedCategory === 'Income') {
      data = mockData.incomes;
    } else if (selectedCategory === 'Expense') {
      data = mockData.expenses;
    } else if (selectedCategory === 'Subscriptions') {
      data = mockData.subscriptions;
    } else if (selectedCategory === 'All') {
      data = [
        ...mockData.incomes.map(item => ({ ...item, type: 'Income' })),
        ...mockData.expenses.map(item => ({ ...item, type: 'Expense' })),
        ...mockData.subscriptions.map(item => ({ ...item, type: 'Subscription' }))
      ];
    }
    setTableData(data.map(({ id, ...rest }) => rest));
  }, [selectedCategory]);

  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    if (/[\",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.map(header => escapeCSV(header)).join(','),
      ...data.map(row =>
        headers.map(header =>
          escapeCSV(row[header])
        ).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const handleDownload = () => {
    const csvData = convertToCSV(tableData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCategory.toLowerCase()}_reports.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return `${currency.symbol} ${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold text-white mb-4">Download Reports</h3>
      <div className="space-y-4">
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            >
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Subscriptions">Subscriptions</option>
            </select>
        </div>
        <div className="flex justify-end space-x-4 pt-2">
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
              Download as CSV
            </button>
        </div>
      </div>
      {tableData.length > 0 && (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-600">
                  {Object.keys(tableData[0]).map(key => (
                    key !== 'id' && <th key={key} className="p-3 text-left text-sm font-semibold text-gray-300">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    {Object.entries(row).map(([key, value]: [string, any], i) => (
                      key !== 'id' && (
                        <td key={i} className="p-3 text-sm text-gray-400">
                          {key === 'amount' ? formatCurrency(value) : String(value)}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 
