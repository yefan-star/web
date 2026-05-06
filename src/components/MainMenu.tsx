import { useState, useEffect } from 'react';
import { getHighScore } from '../utils/gameUtils';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const [highScore, setHighScore] = useState(getHighScore());
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; speed: number }>>([]);

  useEffect(() => {
    const initialStars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1 + 0.5,
    }));
    setStars(initialStars);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) =>
        prev.map((star) => {
          const newY = star.y + star.speed;
          return {
            ...star,
            x: newY > 600 ? Math.random() * 800 : star.x,
            y: newY > 600 ? Math.random() * -10 : newY,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-4 animate-pulse">
          雷霆战机
        </h1>
        <p className="text-xl text-gray-400 mb-8">THUNDER FIGHTER</p>

        <button
          onClick={onStartGame}
          className="group relative px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-2xl font-bold rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/50 active:scale-95"
        >
          <span className="relative z-10">开始游戏</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <div className="mt-12 p-6 bg-black/40 rounded-lg backdrop-blur-sm border border-cyan-500/30">
          <p className="text-gray-400 mb-2">最高分</p>
          <p className="text-3xl font-bold text-cyan-400">{highScore.toString().padStart(8, '0')}</p>
        </div>

        <div className="mt-8 text-gray-500 text-sm space-y-2">
          <p>🎮 操作说明</p>
          <p>方向键 / WASD - 移动战机</p>
          <p>空格键 - 发射子弹</p>
          <p>ESC - 返回菜单</p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-gray-400 text-sm">普通敌机</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500" />
            <span className="text-gray-400 text-sm">精英敌机</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-gray-400 text-sm">BOSS</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white text-xs font-bold">F</div>
            <span className="text-gray-400 text-sm">火力</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white text-xs font-bold">S</div>
            <span className="text-gray-400 text-sm">护盾</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">H</div>
            <span className="text-gray-400 text-sm">生命</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;