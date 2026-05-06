import { Player, Enemy, Bullet, PowerUp, Star, EnemyType } from '../types/game';
import { POWERUP_CONFIG } from './gameUtils';

export const drawStar = (ctx: CanvasRenderingContext2D, star: Star): void => {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
  ctx.fill();
};

export const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player): void => {
  const { x, y, width, height, shieldActive } = player;
  
  ctx.save();
  
  if (shieldActive) {
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, Math.max(width, height) * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(78, 205, 196, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(78, 205, 196, 0.1)';
    ctx.fill();
  }
  
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, '#00d4ff');
  gradient.addColorStop(0.5, '#0099cc');
  gradient.addColorStop(1, '#006699');
  
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width / 2, y + height * 0.7);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + height * 0.3);
  ctx.lineTo(x + width * 0.7, y + height * 0.8);
  ctx.lineTo(x + width / 2, y + height * 0.6);
  ctx.lineTo(x + width * 0.3, y + height * 0.8);
  ctx.closePath();
  ctx.fillStyle = '#00ffff';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height * 0.4, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  
  ctx.restore();
};

export const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy): void => {
  const { x, y, width, height, type } = enemy;
  
  ctx.save();
  
  let gradient: CanvasGradient;
  
  switch (type) {
    case 'normal':
      gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#ff4757');
      gradient.addColorStop(1, '#c0392b');
      break;
    case 'elite':
      gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#a29bfe');
      gradient.addColorStop(1, '#6c5ce7');
      ctx.shadowColor = '#a29bfe';
      ctx.shadowBlur = 15;
      break;
    case 'boss':
      gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#e17055');
      gradient.addColorStop(0.5, '#d35400');
      gradient.addColorStop(1, '#c0392b');
      ctx.shadowColor = '#e17055';
      ctx.shadowBlur = 20;
      break;
  }
  
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + height);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width * 0.7, y + height * 0.3);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width * 0.3, y + height * 0.3);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  
  if (type === 'boss') {
    ctx.beginPath();
    ctx.moveTo(x + width * 0.15, y + height * 0.6);
    ctx.lineTo(x + width * 0.15, y + height * 0.9);
    ctx.lineTo(x + width * 0.05, y + height * 0.9);
    ctx.closePath();
    ctx.fillStyle = '#8b4513';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + width * 0.85, y + height * 0.6);
    ctx.lineTo(x + width * 0.85, y + height * 0.9);
    ctx.lineTo(x + width * 0.95, y + height * 0.9);
    ctx.closePath();
    ctx.fillStyle = '#8b4513';
    ctx.fill();
  }
  
  ctx.restore();
};

export const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet): void => {
  const { x, y, width, height, isPlayerBullet } = bullet;
  
  ctx.save();
  
  if (isPlayerBullet) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#00d4ff');
    
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  } else {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#c0392b');
    
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  ctx.restore();
};

export const drawPowerUp = (ctx: CanvasRenderingContext2D, powerUp: PowerUp): void => {
  const { x, y, width, height, type } = powerUp;
  const config = POWERUP_CONFIG[type];
  
  ctx.save();
  
  ctx.shadowColor = config.glowColor;
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 8);
  ctx.fillStyle = config.color;
  ctx.fill();
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  let icon = '';
  switch (type) {
    case 'firepower':
      icon = 'F';
      break;
    case 'shield':
      icon = 'S';
      break;
    case 'health':
      icon = 'H';
      break;
  }
  ctx.fillText(icon, x + width / 2, y + height / 2);
  
  ctx.restore();
};

export const drawHealthBar = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, health: number, maxHealth: number, type: EnemyType): void => {
  const barWidth = width;
  const barHeight = 4;
  const healthPercent = health / maxHealth;
  
  ctx.save();
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(x, y - 10, barWidth, barHeight);
  
  let color = '#e74c3c';
  if (healthPercent > 0.5) color = '#27ae60';
  else if (healthPercent > 0.25) color = '#f39c12';
  
  ctx.fillStyle = color;
  ctx.fillRect(x, y - 10, barWidth * healthPercent, barHeight);
  
  ctx.restore();
};

export const drawScore = (ctx: CanvasRenderingContext2D, score: number, combo: number, gameTime: number): void => {
  ctx.save();
  
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#00ffff';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 10;
  ctx.fillText(`SCORE: ${score.toString().padStart(8, '0')}`, 20, 40);
  
  if (combo > 1) {
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.fillText(`COMBO x${combo}`, 20, 65);
  }
  
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'transparent';
  ctx.textAlign = 'right';
  ctx.fillText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 780, 40);
  
  ctx.restore();
};

export const drawLives = (ctx: CanvasRenderingContext2D, lives: number): void => {
  ctx.save();
  
  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = '#e74c3c';
  ctx.textAlign = 'right';
  ctx.shadowColor = '#e74c3c';
  ctx.shadowBlur = 8;
  
  let livesText = '';
  for (let i = 0; i < lives; i++) {
    livesText += '❤';
  }
  
  ctx.fillText(livesText, 780, 65);
  
  ctx.restore();
};