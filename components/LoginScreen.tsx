
import React, { useState } from 'react';
import Icon from './Icon';

interface LoginScreenProps {
  onLogin: (user1Name: string, user2Name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [user1Name, setUser1Name] = useState('');
  const [user2Name, setUser2Name] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user1Name.trim() && user2Name.trim()) {
      onLogin(user1Name.trim(), user2Name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
            <Icon name="heart" className="w-16 h-16 text-heart animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-accent mb-2">Our Space</h1>
        <p className="text-text-light mb-8">Your private world, together.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Icon name="user" className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
            <input
              type="text"
              value={user1Name}
              onChange={(e) => setUser1Name(e.target.value)}
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-3 bg-background border-2 border-transparent focus:border-secondary focus:ring-0 rounded-lg text-text-main placeholder-text-light transition"
              required
            />
          </div>
          <div className="relative">
             <Icon name="user" className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
            <input
              type="text"
              value={user2Name}
              onChange={(e) => setUser2Name(e.target.value)}
              placeholder="Partner's Name"
              className="w-full pl-12 pr-4 py-3 bg-background border-2 border-transparent focus:border-secondary focus:ring-0 rounded-lg text-text-main placeholder-text-light transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-heart text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Enter Our Space
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
