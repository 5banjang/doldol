import type { Item } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createItem = (text: string): Item => ({
  id: generateId(),
  text: text.trim(),
  createdAt: Date.now(),
});

export const selectRandomItem = (items: Item[]): Item => {
  if (items.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};