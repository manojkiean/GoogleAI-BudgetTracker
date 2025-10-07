
import React, { useState } from 'react';

interface MyAccountProps {
  user: {
    userId: string;
    name: string;
    email: string;
    currency: string;
  };
  onUpdateUser: (user: MyAccountProps['user']) => void;
  onLogout: () => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ user, onUpdateUser, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSave = () => {
    try {
      //onUpdateUser({ ...user, name, currency });
      onUpdateUser({ ...user, name });
      setMessage({type: 'success', text: 'Account saved successfully!'})
    } catch (error) {
      setMessage({type: 'error', text: 'Failed to save account.'})
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-300">User ID</label>
          <input
            id="userId"
            type="text"
            value={user.userId}
            disabled
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-300">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option>USD</option>
            <option>GBP</option>
            <option>EUR</option>
            <option>INR</option>
            <option>AUD</option>
            <option>SGD</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
