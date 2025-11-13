import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import Icon from './Icon';

interface MemoryMatchGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  photoId: string;
  url: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!context) return null;
  const { photos, users } = context;
  const bothOnline = users[0].online && users[1].online;

  const setupGame = () => {
    if (photos.length < 2) return;
    const gamePhotos = photos.slice(0, 6); // Use up to 6 photos for a 12-card game
    const gameCards = [...gamePhotos, ...gamePhotos]
        .map((photo, index) => ({
            id: index,
            photoId: photo.id,
            url: photo.url,
            isFlipped: false,
            isMatched: false,
        }))
        .sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setMoves(0);
    setGameOver(false);
    setFlippedCards([]);
    setTime(0);
    setIsPlaying(true);
  };
  
  useEffect(() => {
    setupGame();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);
  
  useEffect(() => {
    let intervalId: number | undefined;
    if (isPlaying) {
        intervalId = window.setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 1000);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedCards]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards.find(c => c.id === id)?.isFlipped) return;
    
    const newCards = cards.map(card => card.id === id ? { ...card, isFlipped: true } : card);
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };
  
  const checkForMatch = () => {
    const [firstCardId, secondCardId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstCardId);
    const secondCard = cards.find(c => c.id === secondCardId);

    if (firstCard && secondCard && firstCard.photoId === secondCard.photoId) {
      const newCards = cards.map(card => 
        card.photoId === firstCard.photoId ? { ...card, isMatched: true } : card
      );
      setCards(newCards);
      if(newCards.every(c => c.isMatched)) {
        setGameOver(true);
        setIsPlaying(false);
      }
    } else {
      const newCards = cards.map(card =>
        card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card
      );
      setCards(newCards);
    }
    setFlippedCards([]);
    setMoves(moves + 1);
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

  if (photos.length < 2) {
     return (
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-accent mb-4">Not enough photos!</h2>
            <p className="text-text-light">Please upload at least 2 photos to the gallery to play this game.</p>
            <button onClick={onBack} className="mt-6 bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">Back to Games</button>
        </div>
    );
  }

  return (
    <div>
        <button onClick={onBack} className="mb-4 text-accent font-semibold">&larr; Back to Games</button>
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-accent">Memory Match</h2>
                 <div className="flex items-center space-x-4">
                    <p className="font-semibold text-text-light">Time: {formatTime(time)}</p>
                    <p className="font-semibold text-text-light">Moves: {moves}</p>
                 </div>
            </div>
            
            {gameOver && (
                <div className="text-center p-8">
                    <h3 className="text-2xl font-bold text-heart mb-4">You did it!</h3>
                    <p className="text-text-light">You matched all the photos in {moves} moves and {formatTime(time)}.</p>
                    <button onClick={setupGame} className="mt-4 bg-primary text-text-main font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition">Play Again</button>
                </div>
            )}
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {cards.map(card => (
                    <div key={card.id} className="aspect-square perspective-1000" onClick={() => handleCardClick(card.id)}>
                       <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                            <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-secondary rounded-lg cursor-pointer">
                                <Icon name="heart" className="w-1/2 h-1/2 text-white"/>
                            </div>
                            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg">
                                <img src={card.url} alt="Memory card" className="w-full h-full object-cover rounded-lg"/>
                                {card.isMatched && <div className="absolute inset-0 bg-green-500/50 rounded-lg"/>}
                            </div>
                       </div>
                    </div>
                ))}
            </div>
        </div>
        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; }
        `}</style>
    </div>
  );
};

export default MemoryMatchGame;