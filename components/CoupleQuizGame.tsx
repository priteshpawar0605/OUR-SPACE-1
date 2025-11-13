import React, { useState, useEffect, useContext } from 'react';
import { generateCoupleQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { AppContext } from '../App';
import Icon from './Icon';

interface CoupleQuizGameProps {
  onBack: () => void;
}

const CoupleQuizGame: React.FC<CoupleQuizGameProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ user1: 0, user2: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [turn, setTurn] = useState<'user1' | 'user2'>('user1');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      const fetchedQuestions = await generateCoupleQuiz();
      setQuestions(fetchedQuestions);
      setIsLoading(false);
    };
    fetchQuestions();
  }, []);

  if (!context) return null;
  const { users } = context;
  const bothOnline = users[0].online && users[1].online;

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswerIndex;
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
        if (turn === 'user1') {
            setScores(prev => ({ ...prev, user1: prev.user1 + 1 }));
        } else {
            setScores(prev => ({ ...prev, user2: prev.user2 + 1 }));
        }
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setLastAnswerCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
        setTurn(turn === 'user1' ? 'user2' : 'user1');
    }
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScores({ user1: 0, user2: 0 });
    setSelectedAnswer(null);
    setShowResult(false);
    setLastAnswerCorrect(null);
    setTurn('user1');
    setIsLoading(true);
    generateCoupleQuiz().then(q => {
        setQuestions(q);
        setIsLoading(false);
    });
  }

  if (!bothOnline) {
      return (
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-accent mb-4">Waiting for your partner...</h2>
              <p className="text-text-light">Both partners must be marked as "online" on the Home screen to start the game.</p>
              <button onClick={onBack} className="mt-6 bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">Back to Games</button>
          </div>
      );
  }
  
  if (isLoading) {
    return (
        <div className="text-center p-8">
            <Icon name="lightbulb" className="w-12 h-12 mx-auto text-accent animate-pulse mb-4" />
            <p className="text-text-light">Generating your personal quiz...</p>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= questions.length;
  const answeringPlayer = turn === 'user1' ? users[0].name : users[1].name;

  if(isFinished) {
    return (
         <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-accent mb-4">Quiz Complete!</h2>
              <p className="text-lg text-text-main mb-2">Final Score:</p>
              <p className="text-xl font-semibold text-heart">{users[0].name}: {scores.user1} / {questions.length}</p>
              <p className="text-xl font-semibold text-heart">{users[1].name}: {scores.user2} / {questions.length}</p>
              <div className="mt-6 space-x-4">
                 <button onClick={onBack} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">Back to Games</button>
                <button onClick={restartGame} className="bg-primary text-text-main font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition">Play Again</button>
              </div>
        </div>
    );
  }

  return (
    <div>
        <button onClick={onBack} className="mb-4 text-accent font-semibold">&larr; Back to Games</button>
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-accent">Couple Quiz</h2>
                <div className="text-sm font-semibold text-text-light">
                    <span>{users[0].name}: {scores.user1}</span> | <span>{users[1].name}: {scores.user2}</span>
                </div>
            </div>

            <div className="text-center mb-4 p-2 bg-primary/30 rounded-lg">
                <p className="font-semibold text-accent">
                    It's <span className="font-bold text-heart">{answeringPlayer}'s</span> turn to answer!
                </p>
            </div>

            <p className="text-lg font-semibold text-text-main mb-6">Question {currentQuestionIndex + 1}/{questions.length}: {currentQuestion.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'p-4 rounded-lg text-left transition-transform transform hover:scale-105 ';
                    if (showResult) {
                         if (index === currentQuestion.correctAnswerIndex) {
                            buttonClass += 'bg-green-200 text-green-800';
                         } else if (index === selectedAnswer) {
                            buttonClass += 'bg-red-200 text-red-800';
                         } else {
                            buttonClass += 'bg-gray-100 text-gray-500';
                         }
                    } else {
                        buttonClass += 'bg-primary/50 hover:bg-primary';
                    }

                    return (
                        <button key={index} onClick={() => handleAnswer(index)} disabled={showResult} className={buttonClass}>
                            {option}
                        </button>
                    );
                })}
            </div>
            {showResult && (
                <div className="text-center mt-6">
                    {lastAnswerCorrect === true && (
                        <p className="font-semibold text-green-600 mb-4">{answeringPlayer} got it right! 🎉</p>
                    )}
                    {lastAnswerCorrect === false && (
                        <p className="font-semibold text-red-600 mb-4">Oops, not quite, {answeringPlayer}!</p>
                    )}
                     <button onClick={handleNextQuestion} className="bg-heart text-white font-bold py-2 px-8 rounded-lg hover:bg-opacity-90 transition">
                       {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default CoupleQuizGame;