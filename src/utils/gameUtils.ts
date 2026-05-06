import { Player, Enemy, Bullet, PowerUp, Star, EnemyType, PowerUpType } from '../types/game';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PLAYER_CONFIG = {
  width: 50,
  height: 60,
  speed: 6,
  baseFireRate: 150,
  maxHealth: 3,
};

export const ENEMY_CONFIG: Record<EnemyType, { width: number; height: number; health: number; speed: number; points: number; shootInterval: number }> = {
  normal: { width: 40, height: 40, health: 1, speed: 2, points: 100, shootInterval: 2000 },
  elite: { width: 60, height: 60, health: 3, speed: 1.5, points: 500, shootInterval: 1500 },
  boss: { width: 120, height: 100, health: 20, speed: 0.8, points: 2000, shootInterval: 800 },
};

export const POWERUP_CONFIG: Record<PowerUpType, { color: string; glowColor: string }> = {
  firepower: { color: '#ff6b6b', glowColor: '#ff4757' },
  shield: { color: '#4ecdc4', glowColor: '#26de81' },
  health: { color: '#ffeaa7', glowColor: '#fdcb6e' },
};

let enemyIdCounter = 0;
let bulletIdCounter = 0;
let powerUpIdCounter = 0;

export const createPlayer = (): Player => ({
  x: CANVAS_WIDTH / 2 - PLAYER_CONFIG.width / 2,
  y: CANVAS_HEIGHT - PLAYER_CONFIG.height - 20,
  width: PLAYER_CONFIG.width,
  height: PLAYER_CONFIG.height,
  health: PLAYER_CONFIG.maxHealth,
  firepower: 1,
  shieldActive: false,
});

export const createEnemy = (type: EnemyType, x?: number): Enemy => {
  const config = ENEMY_CONFIG[type];
  const posX = x ?? Math.random() * (CANVAS_WIDTH - config.width);
  return {
    id: ++enemyIdCounter,
    x: posX,
    y: -config.height,
    width: config.width,
    height: config.height,
    type,
    health: config.health,
    speed: config.speed,
    points: config.points,
    shootTimer: 0,
  };
};

export const createPlayerBullet = (player: Player): Bullet[] => {
  const bullets: Bullet[] = [];
  const centerX = player.x + player.width / 2;
  
  switch (player.firepower) {
    case 1:
      bullets.push({
        id: ++bulletIdCounter,
        x: centerX - 3,
        y: player.y,
        width: 6,
        height: 15,
        speed: 10,
        isPlayerBullet: true,
      });
      break;
    case 2:
      bullets.push(
        {
          id: ++bulletIdCounter,
          x: centerX - 15,
          y: player.y,
          width: 6,
          height: 15,
          speed: 10,
          isPlayerBullet: true,
        },
        {
          id: ++bulletIdCounter,
          x: centerX + 9,
          y: player.y,
          width: 6,
          height: 15,
          speed: 10,
          isPlayerBullet: true,
        }
      );
      break;
    case 3:
      bullets.push(
        {
          id: ++bulletIdCounter,
          x: centerX - 3,
          y: player.y,
          width: 6,
          height: 15,
          speed: 10,
          isPlayerBullet: true,
        },
        {
          id: ++bulletIdCounter,
          x: centerX - 20,
          y: player.y + 10,
          width: 5,
          height: 12,
          speed: 9,
          isPlayerBullet: true,
          angle: -0.2,
        },
        {
          id: ++bulletIdCounter,
          x: centerX + 14,
          y: player.y + 10,
          width: 5,
          height: 12,
          speed: 9,
          isPlayerBullet: true,
          angle: 0.2,
        }
      );
      break;
  }
  return bullets;
};

export const createEnemyBullet = (enemy: Enemy): Bullet => ({
  id: ++bulletIdCounter,
  x: enemy.x + enemy.width / 2 - 3,
  y: enemy.y + enemy.height,
  width: 6,
  height: 12,
  speed: 5,
  isPlayerBullet: false,
});

export const createPowerUp = (x: number, y: number): PowerUp => {
  const types: PowerUpType[] = ['firepower', 'shield', 'health'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    id: ++powerUpIdCounter,
    x: x - 15,
    y,
    width: 30,
    height: 30,
    type,
    speed: 2,
  };
};

export const createStars = (count: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.5 + 0.5,
    });
  }
  return stars;
};

export const checkCollision = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

export const resetCounters = (): void => {
  enemyIdCounter = 0;
  bulletIdCounter = 0;
  powerUpIdCounter = 0;
};

export const getHighScore = (): number => {
  const saved = localStorage.getItem('thunderFighter_highScore');
  return saved ? parseInt(saved, 10) : 0;
};

export const setHighScore = (score: number): void => {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem('thunderFighter_highScore', score.toString());
  }
};

export const formatScore = (score: number): string => {
  return score.toString().padStart(8, '0');
};