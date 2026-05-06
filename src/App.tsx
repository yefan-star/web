import { useState } from 'react';
import MainMenu from './components/MainMenu';
import Game from './components/Game';

type GameScreen = 'menu' | 'game';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [lastScore, setLastScore] = useState(0);

  const handleStartGame = () => {
    setScreen('game');
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {screen === 'menu' && <MainMenu onStartGame={handleStartGame} />}
      {screen === 'game' && (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <Game onGameOver={handleGameOver} onBackToMenu={handleBackToMenu} />
        </div>
      )}
    </div>
  );
}