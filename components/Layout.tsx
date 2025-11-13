import React from 'react';
import Icon from './Icon';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavItem: React.FC<{ name: string; icon: string; active: boolean; onClick: () => void }> = ({ name, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full lg:w-48 p-3 lg:px-4 lg:py-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-secondary text-white shadow-md' : 'text-text-main hover:bg-primary/50'
    }`}
  >
    <Icon name={icon} className="w-6 h-6 lg:mr-3" />
    <span className="text-xs lg:text-base font-semibold mt-1 lg:mt-0">{name}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Chat', icon: 'chat' },
    { name: 'Gallery', icon: 'gallery' },
    { name: 'Timeline', icon: 'timeline' },
    { name: 'Games', icon: 'games' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen font-sans text-text-main">
      <header className="hidden lg:flex lg:flex-col items-center w-56 bg-primary/30 p-4 space-y-4">
        <div className="text-2xl font-bold text-accent flex items-center">
            <Icon name="heart" className="w-8 h-8 mr-2 text-heart" />
            Our Space
        </div>
        <nav className="w-full">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavItem
                  name={item.name}
                  icon={item.icon}
                  active={activeTab === item.name}
                  onClick={() => setActiveTab(item.name)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
        {children}
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary/50 shadow-t-lg z-10">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <li key={item.name} className="flex-1">
              <NavItem
                name={item.name}
                icon={item.icon}
                active={activeTab === item.name}
                onClick={() => setActiveTab(item.name)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Layout;