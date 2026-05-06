export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  firepower: number;
  shieldActive: boolean;
}

export type EnemyType = 'normal' | 'elite' | 'boss';

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: EnemyType;
  health: number;
  speed: number;
  points: number;
  shootTimer: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  isPlayerBullet: boolean;
  angle?: number;
}

export type PowerUpType = 'firepower' | 'shield' | 'health';

export interface PowerUp {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
  speed: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  powerUps: PowerUp[];
  stars: Star[];
  score: number;
  combo: number;
  gameTime: number;
  isRunning: boolean;
  isGameOver: boolean;
}

export interface KeyState {
  ArrowLeft: boolean;
  ArrowRight: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
  Space: boolean;
  KeyA: boolean;
  KeyD: boolean;
  KeyW: boolean;
  KeyS: boolean;
}