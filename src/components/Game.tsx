import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, KeyState, EnemyType } from '../types/game';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_CONFIG,
  ENEMY_CONFIG,
  createPlayer,
  createEnemy,
  createPlayerBullet,
  createEnemyBullet,
  createPowerUp,
  createStars,
  checkCollision,
  resetCounters,
  setHighScore,
} from '../utils/gameUtils';
import {
  drawStar,
  drawPlayer,
  drawEnemy,
  drawBullet,
  drawPowerUp,
  drawHealthBar,
  drawScore,
  drawLives,
} from '../utils/renderer';

interface GameProps {
  onGameOver: (score: number) => void;
  onBackToMenu: () => void;
}

const Game = ({ onGameOver, onBackToMenu }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fireTimerRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);
  const enemySpawnTimerRef = useRef<number>(0);
  const comboTimerRef = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState>({
    player: createPlayer(),
    enemies: [],
    bullets: [],
    powerUps: [],
    stars: createStars(100),
    score: 0,
    combo: 0,
    gameTime: 0,
    isRunning: true,
    isGameOver: false,
  });
  
  const keyStateRef = useRef<KeyState>({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    Space: false,
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false,
  });

  const resetGame = useCallback(() => {
    resetCounters();
    gameTimeRef.current = 0;
    fireTimerRef.current = 0;
    enemySpawnTimerRef.current = 0;
    comboTimerRef.current = 0;
    setGameState({
      player: createPlayer(),
      enemies: [],
      bullets: [],
      powerUps: [],
      stars: createStars(100),
      score: 0,
      combo: 0,
      gameTime: 0,
      isRunning: true,
      isGameOver: false,
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keyStateRef.current) {
        keyStateRef.current[e.code as keyof KeyState] = true;
      }
      if (e.code === 'Escape') {
        onBackToMenu();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keyStateRef.current) {
        keyStateRef.current[e.code as keyof KeyState] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onBackToMenu]);

  useEffect(() => {
    if (!gameState.isRunning || gameState.isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setGameState((prev) => {
        if (!prev.isRunning || prev.isGameOver) return prev;

        let newState = { ...prev };
        const keys = keyStateRef.current;
        const { player, enemies, bullets, powerUps, stars } = newState;

        let newPlayer = { ...player };
        let newEnemies = [...enemies];
        let newBullets = [...bullets];
        let newPowerUps = [...powerUps];
        let newStars = stars.map((star) => {
          const newY = star.y + star.speed;
          return {
            ...star,
            x: newY > CANVAS_HEIGHT ? Math.random() * CANVAS_WIDTH : star.x,
            y: newY > CANVAS_HEIGHT ? Math.random() * -10 : newY,
          };
        });

        if (keys.ArrowLeft || keys.KeyA) {
          newPlayer.x = Math.max(0, newPlayer.x - PLAYER_CONFIG.speed);
        }
        if (keys.ArrowRight || keys.KeyD) {
          newPlayer.x = Math.min(CANVAS_WIDTH - newPlayer.width, newPlayer.x + PLAYER_CONFIG.speed);
        }
        if (keys.ArrowUp || keys.KeyW) {
          newPlayer.y = Math.max(0, newPlayer.y - PLAYER_CONFIG.speed);
        }
        if (keys.ArrowDown || keys.KeyS) {
          newPlayer.y = Math.min(CANVAS_HEIGHT - newPlayer.height, newPlayer.y + PLAYER_CONFIG.speed);
        }

        fireTimerRef.current += deltaTime;
        if (keys.Space && fireTimerRef.current >= PLAYER_CONFIG.baseFireRate) {
          const newPlayerBullets = createPlayerBullet(newPlayer);
          newBullets = [...newBullets, ...newPlayerBullets];
          fireTimerRef.current = 0;
        }

        gameTimeRef.current += deltaTime / 1000;
        const currentGameTime = Math.floor(gameTimeRef.current);

        enemySpawnTimerRef.current += deltaTime;
        const spawnInterval = Math.max(300, 1500 - currentGameTime * 10);
        
        if (enemySpawnTimerRef.current >= spawnInterval) {
          if (currentGameTime % 60 === 0 && newEnemies.filter((e) => e.type === 'boss').length === 0) {
            newEnemies.push(createEnemy('boss', CANVAS_WIDTH / 2 - ENEMY_CONFIG.boss.width / 2));
          } else if (currentGameTime % 30 === 15 && newEnemies.filter((e) => e.type === 'elite').length === 0) {
            newEnemies.push(createEnemy('elite'));
          } else {
            newEnemies.push(createEnemy('normal'));
          }
          enemySpawnTimerRef.current = 0;
        }

        newEnemies = newEnemies.map((enemy) => {
          let newEnemy = { ...enemy };
          newEnemy.y += enemy.speed;
          
          if (enemy.type === 'boss') {
            newEnemy.x += Math.sin(gameTimeRef.current) * 0.5;
          }
          
          newEnemy.shootTimer += deltaTime;
          if (newEnemy.shootTimer >= ENEMY_CONFIG[enemy.type].shootInterval) {
            newBullets.push(createEnemyBullet(newEnemy));
            newEnemy.shootTimer = 0;
          }
          
          return newEnemy;
        });

        newBullets = newBullets.map((bullet) => ({
          ...bullet,
          x: bullet.angle ? bullet.x + Math.sin(bullet.angle) * bullet.speed : bullet.x,
          y: bullet.isPlayerBullet ? bullet.y - bullet.speed : bullet.y + bullet.speed,
        }));

        newPowerUps = newPowerUps.map((powerUp) => ({
          ...powerUp,
          y: powerUp.y + powerUp.speed,
        }));

        comboTimerRef.current += deltaTime;
        let newCombo = newState.combo;
        if (comboTimerRef.current >= 2000) {
          newCombo = 0;
          comboTimerRef.current = 0;
        }

        let newScore = newState.score;

        const bulletsToRemove: number[] = [];
        const enemiesToRemove: number[] = [];

        newBullets.forEach((bullet) => {
          if (bullet.isPlayerBullet) {
            newEnemies.forEach((enemy) => {
              if (checkCollision(bullet, enemy)) {
                bulletsToRemove.push(bullet.id);
                const newHealth = enemy.health - 1;
                if (newHealth <= 0) {
                  enemiesToRemove.push(enemy.id);
                  newCombo += 1;
                  comboTimerRef.current = 0;
                  const comboBonus = Math.floor(newCombo / 2);
                  newScore += enemy.points * (1 + comboBonus * 0.5);
                  
                  if (Math.random() < 0.2) {
                    newPowerUps.push(createPowerUp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                  }
                } else {
                  const idx = newEnemies.findIndex((e) => e.id === enemy.id);
                  if (idx !== -1) {
                    newEnemies[idx] = { ...newEnemies[idx], health: newHealth };
                  }
                }
              }
            });
          } else {
            if (checkCollision(bullet, newPlayer)) {
              bulletsToRemove.push(bullet.id);
              if (!newPlayer.shieldActive) {
                newPlayer.health -= 1;
                newCombo = 0;
              }
            }
          }
        });

        newEnemies.forEach((enemy) => {
          if (checkCollision(enemy, newPlayer)) {
            enemiesToRemove.push(enemy.id);
            if (!newPlayer.shieldActive) {
              newPlayer.health -= 1;
              newCombo = 0;
            }
          }
        });

        newPowerUps.forEach((powerUp) => {
          if (checkCollision(powerUp, newPlayer)) {
            switch (powerUp.type) {
              case 'firepower':
                newPlayer.firepower = Math.min(3, newPlayer.firepower + 1);
                break;
              case 'shield':
                newPlayer.shieldActive = true;
                setTimeout(() => {
                  setGameState((s) => ({ ...s, player: { ...s.player, shieldActive: false } }));
                }, 5000);
                break;
              case 'health':
                newPlayer.health = Math.min(PLAYER_CONFIG.maxHealth, newPlayer.health + 1);
                break;
            }
            newPowerUps = newPowerUps.filter((p) => p.id !== powerUp.id);
          }
        });

        newBullets = newBullets.filter(
          (b) =>
            !bulletsToRemove.includes(b.id) &&
            b.y > -b.height &&
            b.y < CANVAS_HEIGHT + b.height &&
            b.x > -b.width &&
            b.x < CANVAS_WIDTH + b.width
        );

        newEnemies = newEnemies.filter(
          (e) => !enemiesToRemove.includes(e.id) && e.y < CANVAS_HEIGHT + e.height
        );

        newPowerUps = newPowerUps.filter((p) => p.y < CANVAS_HEIGHT + p.height);

        if (newPlayer.health <= 0) {
          setHighScore(newScore);
          return {
            ...newState,
            player: newPlayer,
            enemies: newEnemies,
            bullets: newBullets,
            powerUps: newPowerUps,
            stars: newStars,
            score: newScore,
            combo: newCombo,
            gameTime: currentGameTime,
            isRunning: false,
            isGameOver: true,
          };
        }

        return {
          ...newState,
          player: newPlayer,
          enemies: newEnemies,
          bullets: newBullets,
          powerUps: newPowerUps,
          stars: newStars,
          score: newScore,
          combo: newCombo,
          gameTime: currentGameTime,
        };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isRunning, gameState.isGameOver]);

  useEffect(() => {
    if (gameState.isGameOver) {
      onGameOver(gameState.score);
    }
  }, [gameState.isGameOver, gameState.score, onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameState.stars.forEach((star) => drawStar(ctx, star));
    gameState.powerUps.forEach((powerUp) => drawPowerUp(ctx, powerUp));
    gameState.bullets.forEach((bullet) => drawBullet(ctx, bullet));
    gameState.enemies.forEach((enemy) => {
      drawEnemy(ctx, enemy);
      if (enemy.type !== 'normal') {
        drawHealthBar(ctx, enemy.x, enemy.y, enemy.width, enemy.health, ENEMY_CONFIG[enemy.type].health, enemy.type);
      }
    });
    drawPlayer(ctx, gameState.player);
    drawScore(ctx, gameState.score, gameState.combo, gameState.gameTime);
    drawLives(ctx, gameState.player.health);
  }, [gameState]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/30"
      />
      {gameState.isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
          <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
          <p className="text-2xl text-cyan-400 mb-2">最终得分: {gameState.score}</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              重新开始
            </button>
            <button
              onClick={onBackToMenu}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all hover:scale-105"
            >
              返回菜单
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 text-gray-400 text-sm">
        <p>操作说明: 方向键/WASD 移动 | 空格键 射击 | ESC 返回菜单</p>
      </div>
    </div>
  );
};

export default Game;