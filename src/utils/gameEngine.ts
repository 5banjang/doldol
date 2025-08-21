import type { GameStats, DynamicTimingConfig, TimingGame } from '../types';

export const calculateDifficulty = (stats: GameStats, userSetting: string): 'easy' | 'normal' | 'hard' | 'expert' => {
  if (userSetting !== 'auto') {
    return userSetting as 'easy' | 'normal' | 'hard' | 'expert';
  }

  const { consecutiveSuccess, consecutiveFails } = stats;

  if (consecutiveFails >= 3) {
    return 'easy';
  }

  if (consecutiveSuccess >= 10) {
    return 'expert';
  } else if (consecutiveSuccess >= 6) {
    return 'hard';
  } else if (consecutiveSuccess >= 3) {
    return 'normal';
  }

  return 'easy';
};

export const getDifficultyConfig = (difficulty: 'easy' | 'normal' | 'hard' | 'expert'): DynamicTimingConfig => {
  const configs = {
    easy: {
      perfectZoneSize: 20, // 20% of total duration
      goodZoneSize: 35, // 35% of total duration
      zonePosition: Math.random() * 40 + 30, // 30-70% position
      animationSpeed: 1.2 // slower
    },
    normal: {
      perfectZoneSize: 10, // 10%
      goodZoneSize: 25, // 25%
      zonePosition: Math.random() * 60 + 20, // 20-80%
      animationSpeed: 1.0 // normal
    },
    hard: {
      perfectZoneSize: 6, // 6%
      goodZoneSize: 18, // 18%
      zonePosition: Math.random() * 70 + 15, // 15-85%
      animationSpeed: 0.8 // faster
    },
    expert: {
      perfectZoneSize: 4, // 4%
      goodZoneSize: 12, // 12%
      zonePosition: Math.random() * 80 + 10, // 10-90%
      animationSpeed: 0.7 // fastest
    }
  };

  return configs[difficulty];
};

export const createTimingGame = (animationDuration: number, stats: GameStats, userSetting = 'auto'): TimingGame => {
  const difficulty = calculateDifficulty(stats, userSetting);
  const config = getDifficultyConfig(difficulty);
  
  const adjustedDuration = animationDuration * config.animationSpeed;
  const perfectZoneSize = (adjustedDuration * config.perfectZoneSize) / 100;
  
  const zoneCenter = (adjustedDuration * config.zonePosition) / 100;
  const perfectStart = zoneCenter - perfectZoneSize / 2;
  const perfectEnd = zoneCenter + perfectZoneSize / 2;
  
  return {
    isActive: true,
    startTime: Date.now(),
    targetZoneStart: perfectStart,
    targetZoneEnd: perfectEnd,
    targetZonePosition: config.zonePosition,
    difficulty,
    accuracy: undefined
  };
};

export const calculateRewards = (accuracy: 'perfect' | 'good' | 'miss', difficulty: string, consecutiveSuccess: number): number => {
  const baseXP = {
    perfect: 25,
    good: 10,
    miss: 0
  };

  const difficultyMultiplier = {
    easy: 1.0,
    normal: 1.2,
    hard: 1.5,
    expert: 2.0
  };

  const comboBonus = Math.min(consecutiveSuccess * 2, 20); // max +20 XP
  
  const multiplier = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1.0;
  
  return Math.floor((baseXP[accuracy] * multiplier) + (accuracy === 'perfect' ? comboBonus : 0));
};

export const updateGameStats = (
  currentStats: GameStats,
  accuracy: 'perfect' | 'good' | 'miss',
  xpGained: number
): GameStats => {
  const newStats = { ...currentStats };
  
  newStats.totalGachas++;
  newStats.xp += xpGained;
  
  if (accuracy === 'perfect') {
    newStats.perfectTimings++;
    newStats.consecutiveSuccess++;
    newStats.consecutiveFails = 0;
  } else if (accuracy === 'good') {
    newStats.consecutiveSuccess++;
    newStats.consecutiveFails = 0;
  } else {
    newStats.consecutiveSuccess = 0;
    newStats.consecutiveFails++;
  }
  
  // Level up logic
  const xpForNextLevel = (newStats.level * 100) + 100;
  if (newStats.xp >= xpForNextLevel) {
    newStats.level++;
    newStats.xp -= xpForNextLevel;
  }
  
  return newStats;
};

export const triggerHapticFeedback = (accuracy: 'perfect' | 'good' | 'miss') => {
  if (!navigator.vibrate) return;
  
  const patterns = {
    perfect: [100, 50, 100],
    good: [100],
    miss: [50, 50, 50]
  };
  
  navigator.vibrate(patterns[accuracy]);
};