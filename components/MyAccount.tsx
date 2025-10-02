
import React from 'react';

interface MyAccountProps {
  user: {
    userId: string;
    name: string;
    currency: string;
  };
  onLogout: () => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ user, onLogout }) => {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">User ID:</span> {user.userId}</p>
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Currency:</span> {user.currency}</p>
      </div>
      <button
        onClick={onLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default MyAccount;
