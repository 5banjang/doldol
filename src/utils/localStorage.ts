import type { Favorite } from '../types';

const FAVORITES_KEY = 'doldol-favorites';

export const saveFavorites = (favorites: Favorite[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

export const loadFavorites = (): Favorite[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate the structure
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter((favorite: any) => 
      favorite &&
      typeof favorite.id === 'string' &&
      typeof favorite.name === 'string' &&
      Array.isArray(favorite.items) &&
      typeof favorite.createdAt === 'number'
    );
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
    return [];
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Failed to clear data from localStorage:', error);
  }
};