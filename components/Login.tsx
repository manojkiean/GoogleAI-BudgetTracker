
import React, { useState } from 'react';
import { mockUsers } from '../utils/config';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      const user = mockUsers.find((u) => u.userId === userId);
      if (user && user.password === password) {
        onLogin(user.userId);
      } else {
        setError('Invalid user ID or password');
      }
    } else {
      // In a real application, you would register the user here.
      // For this example, we'll just call onLogin directly.
      console.log('Registering with:', { name, userId, password });
      onLogin(userId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-cyan-400 hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center w-full bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              <span className="ml-3">Google</span>
            </button>
            <button className="flex items-center justify-center w-full bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              <span className="ml-3">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
