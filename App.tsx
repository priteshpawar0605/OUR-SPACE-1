
import React, { useState, createContext, useContext } from 'react';
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import GalleryScreen from './components/GalleryScreen';
import TimelineScreen from './components/TimelineScreen';
import GamesScreen from './components/GamesScreen';
import { User, Photo, Memory, Message } from './types';

interface AppContextType {
  users: [User, User];
  setUsers: React.Dispatch<React.SetStateAction<[User, User]>>;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  memories: Memory[];
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [users, setUsers] = useState<[User, User] | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleLogin = (user1Name: string, user2Name: string) => {
    setUsers([
      { id: 1, name: user1Name, online: false },
      { id: 2, name: user2Name, online: false },
    ]);
  };

  if (!users) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Chat':
        return <ChatScreen />;
      case 'Gallery':
        return <GalleryScreen />;
      case 'Timeline':
        return <TimelineScreen />;
      case 'Games':
        return <GamesScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const appContextValue: AppContextType = {
    users,
    setUsers: setUsers as React.Dispatch<React.SetStateAction<[User, User]>>,
    photos,
    setPhotos,
    memories,
    setMemories,
    messages,
    setMessages,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
