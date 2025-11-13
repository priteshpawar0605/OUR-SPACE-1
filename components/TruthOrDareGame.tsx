import React, { useState, useContext } from 'react';
import { generateTruthOrDare } from '../services/geminiService';
import { AppContext } from '../App';
import Icon from './Icon';

interface TruthOrDareGameProps {
  onBack: () => void;
}

const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [prompt, setPrompt] = useState('');
  const [promptType, setPromptType] = useState<'truth' | 'dare' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!context) return null;
  const { users } = context;
  const bothOnline = users[0].online && users[1].online;

  const getPrompt = async (type: 'truth' | 'dare') => {
    setIsLoading(true);
    setPromptType(type);
    const newPrompt = await generateTruthOrDare(type);
    setPrompt(newPrompt);
    setIsLoading(false);
  };

  if (!bothOnline) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-accent mb-4">Waiting for your partner...</h2>
            <p className="text-text-light">Both partners must be marked as "online" on the Home screen to start the game.</p>
            <button onClick={onBack} className="mt-6 bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">Back to Games</button>
        </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-accent font-semibold">&larr; Back to Games</button>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-accent mb-6">Truth or Dare</h2>
        
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center">
                 <Icon name="heart" className="w-12 h-12 text-heart animate-ping" />
            </div>
        ) : prompt ? (
             <div className="min-h-[150px] flex flex-col items-center justify-center">
                <p className={`text-sm font-bold uppercase ${promptType === 'truth' ? 'text-blue-500' : 'text-red-500'}`}>{promptType}</p>
                <p className="text-xl text-text-main mt-2">{prompt}</p>
            </div>
        ) : (
            <div className="min-h-[150px] flex items-center justify-center">
                <p className="text-text-light">Choose your challenge!</p>
            </div>
        )}

        <div className="flex justify-center items-center space-x-4 mt-6">
            <button 
                onClick={() => getPrompt('truth')} 
                disabled={isLoading}
                className="bg-blue-200 text-blue-800 font-bold py-3 px-8 rounded-lg hover:bg-blue-300 transition-colors disabled:opacity-50"
            >
                Truth
            </button>
            <button 
                onClick={() => getPrompt('dare')} 
                disabled={isLoading}
                className="bg-red-200 text-red-800 font-bold py-3 px-8 rounded-lg hover:bg-red-300 transition-colors disabled:opacity-50"
            >
                Dare
            </button>
            {prompt && !isLoading && (
                <button
                    onClick={() => getPrompt(promptType!)}
                    className="bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Get a new prompt"
                >
                    <Icon name="refresh-cw" className="w-6 h-6" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default TruthOrDareGame;