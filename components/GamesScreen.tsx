
import React, { useState } from 'react';
import Icon from './Icon';
import CoupleQuizGame from './CoupleQuizGame';
import TruthOrDareGame from './TruthOrDareGame';
import MemoryMatchGame from './MemoryMatchGame';

type Game = 'quiz' | 'truthordare' | 'memorymatch' | null;

const GameCard: React.FC<{title: string, description: string, icon: string, onClick: () => void}> = ({ title, description, icon, onClick }) => (
    <div onClick={onClick} className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all transform text-center">
        <Icon name={icon} className="w-12 h-12 mx-auto text-accent mb-4" />
        <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
        <p className="text-text-light">{description}</p>
    </div>
);

const GamesScreen: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game>(null);

    const renderGame = () => {
        switch(activeGame) {
            case 'quiz':
                return <CoupleQuizGame onBack={() => setActiveGame(null)} />;
            case 'truthordare':
                return <TruthOrDareGame onBack={() => setActiveGame(null)} />;
            case 'memorymatch':
                return <MemoryMatchGame onBack={() => setActiveGame(null)} />;
            default:
                return null;
        }
    };

    if (activeGame) {
        return renderGame();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-main mb-6">Game Night!</h1>
            <p className="text-text-light mb-8">Choose a game to play together. You must both be "online" on the Home screen to start!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GameCard 
                    title="Couple Quiz" 
                    description="Test how well you know each other with fun questions."
                    icon="help-circle"
                    onClick={() => setActiveGame('quiz')}
                />
                <GameCard 
                    title="Truth or Dare" 
                    description="Get to know each other even better with romantic truths or dares."
                    icon="heart"
                    onClick={() => setActiveGame('truthordare')}
                />
                <GameCard 
                    title="Memory Match" 
                    description="Match pairs of your favorite photos from the gallery."
                    icon="gallery"
                    onClick={() => setActiveGame('memorymatch')}
                />
            </div>
        </div>
    );
};

export default GamesScreen;
