import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction, Item, Favorite } from '../types';
import { generateId, createItem } from '../utils/helpers';
import { saveFavorites, loadFavorites } from '../utils/localStorage';

const initialState: AppState = {
  currentItems: [],
  favorites: [],
  isLoading: true,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (!action.payload.trim()) return state;
      return {
        ...state,
        currentItems: [...state.currentItems, createItem(action.payload)],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        currentItems: state.currentItems.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_ITEMS':
      return {
        ...state,
        currentItems: [],
      };

    case 'LOAD_ITEMS':
      return {
        ...state,
        currentItems: action.payload,
      };

    case 'ADD_FAVORITE':
      const updatedFavorites = [...state.favorites, action.payload];
      saveFavorites(updatedFavorites);
      return {
        ...state,
        favorites: updatedFavorites,
      };

    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(fav => fav.id !== action.payload);
      saveFavorites(filteredFavorites);
      return {
        ...state,
        favorites: filteredFavorites,
      };

    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
        isLoading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addItem: (text: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  loadItems: (items: Item[]) => void;
  addFavorite: (name: string, items: Item[]) => void;
  removeFavorite: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const favorites = loadFavorites();
    dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
  }, []);

  const addItem = (text: string) => {
    dispatch({ type: 'ADD_ITEM', payload: text });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearItems = () => {
    dispatch({ type: 'CLEAR_ITEMS' });
  };

  const loadItems = (items: Item[]) => {
    dispatch({ type: 'LOAD_ITEMS', payload: items });
  };

  const addFavorite = (name: string, items: Item[]) => {
    const favorite: Favorite = {
      id: generateId(),
      name: name.trim(),
      items: [...items],
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_FAVORITE', payload: favorite });
  };

  const removeFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const value: AppContextValue = {
    state,
    dispatch,
    addItem,
    removeItem,
    clearItems,
    loadItems,
    addFavorite,
    removeFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};