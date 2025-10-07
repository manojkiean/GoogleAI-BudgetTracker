
import React, { useState, useEffect } from 'react';
import { Currency, Transaction } from '../types';

interface ReportsProps {
  currency: Currency;
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ currency, transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    let data: Transaction[] = [];
    if (selectedCategory === 'Income') {
      data = transactions.filter(t => t.type === 'income');
    } else if (selectedCategory === 'Expense') {
      data = transactions.filter(t => t.type === 'expense');
    } else if (selectedCategory === 'Subscriptions') {
      data = transactions.filter(t => t.type === 'subscription');
    } else if (selectedCategory === 'All') {
      data = transactions;
    }

    let headers: string[] = [];
    if (selectedCategory === 'All') {
        headers = ['type', 'source', 'category', 'amount', 'date', 'account', 'subscriptionType', 'frequency'];
    } else if (selectedCategory === 'Subscriptions') {
        headers = ['type', 'source', 'category', 'amount', 'date', 'account', 'subscriptionType', 'frequency'];
    } else { // Income and Expense
        headers = ['type', 'source', 'category', 'amount', 'date', 'account'];
    }
    setTableHeaders(headers);

    const processedData = data.map(item => {
      const row: any = {};
      headers.forEach(header => {
        const value = item[header as keyof Transaction];
        if (header === 'date' && value) {
            row[header] = formatDate(value as string);
        } else {
            row[header] = value !== undefined && value !== null ? value : '';
        }
      });
      return row;
    });

    setTableData(processedData);
  }, [selectedCategory, transactions]);

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
    const headers = tableHeaders;
    const csvRows = [
      headers.map(header => escapeCSV(header.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()))).join(','),
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
                  {tableHeaders.map(key => (
                    <th key={key} className="p-3 text-left text-sm font-semibold text-gray-300">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-600">
                     {tableHeaders.map(header => (
                        <td key={header} className="p-3 text-sm text-gray-400">
                        {header === 'amount' ? formatCurrency(row[header]) : row[header]}
                        </td>
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
