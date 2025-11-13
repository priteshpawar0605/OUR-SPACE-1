
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import Icon from './Icon';
import { User } from '../types';

const PresenceCard: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { users, setUsers } = context;

    const toggleOnlineStatus = (id: number) => {
        setUsers(prevUsers => 
            prevUsers.map(u => u.id === id ? { ...u, online: !u.online } : u) as [User, User]
        );
    };

    const bothOnline = users[0].online && users[1].online;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">Presence</h2>
            <div className="space-y-3">
                {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                        <span className="font-semibold text-text-main">{user.name}</span>
                        <button onClick={() => toggleOnlineStatus(user.id)} className={`p-2 rounded-full transition-colors ${user.online ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                           <Icon name={user.online ? 'toggle-on' : 'toggle-off'} />
                        </button>
                    </div>
                ))}
            </div>
            {bothOnline && (
                <div className="mt-4 text-center bg-primary/50 text-heart font-semibold p-3 rounded-lg animate-pulse">
                    You're both here! 💕
                </div>
            )}
        </div>
    );
};

const CountdownCard: React.FC = () => {
    const [targetDate, setTargetDate] = useState(() => {
        const savedDate = localStorage.getItem('ourspace-countdown-date');
        return savedDate ? new Date(savedDate) : new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000); // Default to 2 weeks from now
    });
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        localStorage.setItem('ourspace-countdown-date', targetDate.toISOString());
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("The time is now!");
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setTargetDate(new Date(e.target.value));
        }
    };
    
    return (
         <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">Countdown</h2>
            <p className="text-text-light mb-2">Until we meet again...</p>
            <div className="text-3xl font-bold text-heart bg-primary/30 p-4 rounded-lg text-center mb-4">
                {timeLeft}
            </div>
            <input type="datetime-local" onChange={handleDateChange} defaultValue={targetDate.toISOString().substring(0, 16)} className="w-full p-2 border border-secondary/50 rounded-lg"/>
        </div>
    );
};


const SurpriseCard: React.FC = () => {
    const [targetDate] = useState(new Date('2025-02-14T00:00:00')); // Valentine's Day
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        const checkDate = () => {
            if (new Date() > targetDate) {
                setUnlocked(true);
            }
        };
        checkDate();
        const interval = setInterval(checkDate, 60000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Icon name={unlocked ? 'gift' : 'lock'} className={`w-12 h-12 mx-auto mb-4 ${unlocked ? 'text-heart' : 'text-accent'}`}/>
            <h2 className="text-xl font-bold text-accent mb-2">A Little Surprise</h2>
            {unlocked ? (
                 <p className="text-text-main">Happy Valentine's Day, my love! Every moment with you is a gift. ❤️</p>
            ) : (
                <>
                    <p className="text-text-light">Unlocks on:</p>
                    <p className="font-semibold">{targetDate.toLocaleDateString()}</p>
                </>
            )}
        </div>
    );
};


const WishlistCard: React.FC<{ user: User }> = ({ user }) => {
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">{user.name}'s Wishlist</h2>
            <ul className="space-y-2 mb-4">
                {items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-background p-2 rounded-md">
                        <span>{item}</span>
                        <button onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600">
                            <Icon name="trash" className="w-4 h-4" />
                        </button>
                    </li>
                ))}
                 {items.length === 0 && <p className="text-text-light italic">Add something to the list!</p>}
            </ul>
            <form onSubmit={handleAddItem} className="flex space-x-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="New wish..."
                    className="flex-grow p-2 border border-secondary/50 rounded-lg focus:ring-accent focus:border-accent"
                />
                <button type="submit" className="bg-secondary text-white p-2 rounded-lg hover:bg-accent">
                    <Icon name="plus" />
                </button>
            </form>
        </div>
    );
};


const HomeScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { users } = context;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
             <h1 className="text-3xl font-bold text-text-main">Welcome Home, {users[0].name} & {users[1].name}!</h1>
             <p className="text-text-light">Here's a glimpse of your shared world.</p>
        </div>
        <PresenceCard />
        <CountdownCard />
        <SurpriseCard />
        <WishlistCard user={users[0]} />
        <WishlistCard user={users[1]} />
    </div>
  );
};

export default HomeScreen;
