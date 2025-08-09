import type { GameStats, Achievement } from '../types';

const GAME_STATS_KEY = 'doldol-game-stats';

// 기본 게임 통계
export const defaultGameStats: GameStats = {
  level: 1,
  xp: 0,
  totalGachas: 0,
  perfectTimings: 0,
  achievements: [],
  unlockedThemes: ['default'],
};

// 업적 정의
export const achievements: Achievement[] = [
  {
    id: 'first_gacha',
    name: '첫 뽑기',
    description: '첫 번째 가챠를 완료했습니다',
    icon: '🎯',
    condition: (stats) => stats.totalGachas >= 1,
    xpReward: 10,
  },
  {
    id: 'perfect_timing',
    name: '완벽한 타이밍',
    description: '완벽한 타이밍으로 가챠를 멈췄습니다',
    icon: '⏰',
    condition: (stats) => stats.perfectTimings >= 1,
    xpReward: 20,
  },
  {
    id: 'gacha_master',
    name: '가챠 마스터',
    description: '10번의 가챠를 완료했습니다',
    icon: '🏆',
    condition: (stats) => stats.totalGachas >= 10,
    xpReward: 50,
  },
  {
    id: 'timing_expert',
    name: '타이밍 전문가',
    description: '5번의 완벽한 타이밍을 달성했습니다',
    icon: '🎖️',
    condition: (stats) => stats.perfectTimings >= 5,
    xpReward: 100,
  },
  {
    id: 'veteran',
    name: '베테랑',
    description: '50번의 가챠를 완료했습니다',
    icon: '👑',
    condition: (stats) => stats.totalGachas >= 50,
    xpReward: 200,
  },
];

// XP를 레벨로 변환하는 함수
export const getLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

// 현재 레벨의 필요 XP
export const getXPForLevel = (level: number): number => {
  return (level - 1) * 100;
};

// 다음 레벨까지 필요한 XP
export const getXPToNextLevel = (currentXP: number): number => {
  const currentLevel = getLevel(currentXP);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  return nextLevelXP - currentXP;
};

// 현재 레벨에서의 진행률 (0-100%)
export const getLevelProgress = (currentXP: number): number => {
  const currentLevel = getLevel(currentXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const progressXP = currentXP - currentLevelXP;
  const totalNeededXP = nextLevelXP - currentLevelXP;
  
  return Math.floor((progressXP / totalNeededXP) * 100);
};

// 게임 통계 불러오기
export const loadGameStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(GAME_STATS_KEY);
    if (!stored) return { ...defaultGameStats };
    
    const parsed = JSON.parse(stored);
    
    // 구조 검증
    return {
      level: parsed.level || 1,
      xp: parsed.xp || 0,
      totalGachas: parsed.totalGachas || 0,
      perfectTimings: parsed.perfectTimings || 0,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      unlockedThemes: Array.isArray(parsed.unlockedThemes) ? parsed.unlockedThemes : ['default'],
    };
  } catch (error) {
    console.error('Failed to load game stats:', error);
    return { ...defaultGameStats };
  }
};

// 게임 통계 저장하기
export const saveGameStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(GAME_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save game stats:', error);
  }
};

// XP 추가 및 레벨업 확인
export const addXP = (currentStats: GameStats, xpToAdd: number): { newStats: GameStats; leveledUp: boolean; newAchievements: Achievement[] } => {
  const oldLevel = currentStats.level;
  const newXP = currentStats.xp + xpToAdd;
  const newLevel = getLevel(newXP);
  
  const newStats = {
    ...currentStats,
    xp: newXP,
    level: newLevel,
  };
  
  // 새로운 업적 확인
  const newAchievements = achievements.filter(
    achievement => 
      !currentStats.achievements.includes(achievement.id) &&
      achievement.condition(newStats)
  );
  
  // 업적 달성 시 추가 XP와 테마 해제
  if (newAchievements.length > 0) {
    const bonusXP = newAchievements.reduce((total, achievement) => total + achievement.xpReward, 0);
    newStats.xp += bonusXP;
    newStats.level = getLevel(newStats.xp);
    newStats.achievements = [...currentStats.achievements, ...newAchievements.map(a => a.id)];
    
    // 특별 업적에 따른 테마 해제
    if (newAchievements.some(a => a.id === 'timing_expert')) {
      newStats.unlockedThemes = [...newStats.unlockedThemes, 'golden'];
    }
    if (newAchievements.some(a => a.id === 'veteran')) {
      newStats.unlockedThemes = [...newStats.unlockedThemes, 'rainbow'];
    }
  }
  
  return {
    newStats,
    leveledUp: newLevel > oldLevel,
    newAchievements,
  };
};

// 가챠 완료 통계 업데이트
export const updateGachaStats = (
  currentStats: GameStats, 
  timingAccuracy?: 'perfect' | 'good' | 'miss'
): { newStats: GameStats; leveledUp: boolean; newAchievements: Achievement[] } => {
  let xpGained = 10; // 기본 XP
  
  // 타이밍에 따른 추가 XP
  if (timingAccuracy === 'perfect') {
    xpGained += 15;
  } else if (timingAccuracy === 'good') {
    xpGained += 5;
  }
  
  const updatedStats = {
    ...currentStats,
    totalGachas: currentStats.totalGachas + 1,
    perfectTimings: timingAccuracy === 'perfect' ? currentStats.perfectTimings + 1 : currentStats.perfectTimings,
  };
  
  return addXP(updatedStats, xpGained);
};