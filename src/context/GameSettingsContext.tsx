import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { GameSettings } from '../types';

const defaultSettings: GameSettings = {
  difficulty: 'auto',
  animation: 'full',
  haptics: true,
  sounds: false
};

type SettingsAction =
  | { type: 'SET_DIFFICULTY'; payload: GameSettings['difficulty'] }
  | { type: 'SET_ANIMATION'; payload: GameSettings['animation'] }
  | { type: 'SET_HAPTICS'; payload: boolean }
  | { type: 'SET_SOUNDS'; payload: boolean }
  | { type: 'LOAD_SETTINGS'; payload: GameSettings };

const settingsReducer = (state: GameSettings, action: SettingsAction): GameSettings => {
  switch (action.type) {
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'SET_ANIMATION':
      return { ...state, animation: action.payload };
    case 'SET_HAPTICS':
      return { ...state, haptics: action.payload };
    case 'SET_SOUNDS':
      return { ...state, sounds: action.payload };
    case 'LOAD_SETTINGS':
      return action.payload;
    default:
      return state;
  }
};

interface GameSettingsContextValue {
  settings: GameSettings;
  setDifficulty: (difficulty: GameSettings['difficulty']) => void;
  setAnimation: (animation: GameSettings['animation']) => void;
  setHaptics: (enabled: boolean) => void;
  setSounds: (enabled: boolean) => void;
}

const GameSettingsContext = createContext<GameSettingsContextValue | undefined>(undefined);

const STORAGE_KEY = 'doldol_game_settings';

export const GameSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings);

  // 설정 로드
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: { ...defaultSettings, ...parsedSettings } });
      }
    } catch (error) {
      console.error('Failed to load game settings:', error);
    }
  }, []);

  // 설정 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save game settings:', error);
    }
  }, [settings]);

  const setDifficulty = (difficulty: GameSettings['difficulty']) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  };

  const setAnimation = (animation: GameSettings['animation']) => {
    dispatch({ type: 'SET_ANIMATION', payload: animation });
  };

  const setHaptics = (enabled: boolean) => {
    dispatch({ type: 'SET_HAPTICS', payload: enabled });
  };

  const setSounds = (enabled: boolean) => {
    dispatch({ type: 'SET_SOUNDS', payload: enabled });
  };

  const value: GameSettingsContextValue = {
    settings,
    setDifficulty,
    setAnimation,
    setHaptics,
    setSounds
  };

  return (
    <GameSettingsContext.Provider value={value}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = (): GameSettingsContextValue => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};