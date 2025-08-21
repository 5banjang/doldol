export interface Item {
  id: string;
  text: string;
  createdAt: number;
}

export interface Favorite {
  id: string;
  name: string;
  items: Item[];
  createdAt: number;
}

export interface AppState {
  currentItems: Item[];
  favorites: Favorite[];
  isLoading: boolean;
}

export type AppAction =
  | { type: 'ADD_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_ITEMS' }
  | { type: 'LOAD_ITEMS'; payload: Item[] }
  | { type: 'ADD_FAVORITE'; payload: Favorite }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: Favorite[] }
  | { type: 'SET_LOADING'; payload: boolean };

export interface GachaResult {
  selectedItem: Item;
  animationDuration: number;
  timingAccuracy?: 'perfect' | 'good' | 'miss';
  bonusXP?: number;
}

export interface GameStats {
  level: number;
  xp: number;
  totalGachas: number;
  perfectTimings: number;
  consecutiveSuccess: number;
  consecutiveFails: number;
  achievements: string[];
  unlockedThemes: string[];
}

export interface TimingGame {
  isActive: boolean;
  startTime: number;
  targetZoneStart: number;
  targetZoneEnd: number;
  targetZonePosition: number;
  userStopTime?: number;
  accuracy?: 'perfect' | 'good' | 'miss';
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
}

export type GachaGameMode = 'ready' | 'animating' | 'timing' | 'result';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
  xpReward: number;
}

export interface GameSettings {
  difficulty: 'auto' | 'easy' | 'normal' | 'hard' | 'expert';
  animation: 'full' | 'reduced' | 'minimal';
  haptics: boolean;
  sounds: boolean;
}

export interface DynamicTimingConfig {
  perfectZoneSize: number;
  goodZoneSize: number;
  zonePosition: number;
  animationSpeed: number;
}