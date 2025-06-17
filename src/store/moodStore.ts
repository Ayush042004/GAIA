import { create } from 'zustand';
import { MoodLeaderboard, MoodEntry } from '../types';

interface MoodState {
  currentMood: string | null;
  moodLeaderboard: MoodLeaderboard[];
  detectedMood: string | null;
  moodHistory: MoodEntry[];
  setCurrentMood: (mood: string) => void;
  setDetectedMood: (mood: string, confidence: number) => void;
  addMoodEntry: (mood: string, confidence: number, context?: string) => void;
  getMoodLeaderboard: () => MoodLeaderboard[];
}

const mockMoodLeaderboard: MoodLeaderboard[] = [
  {
    mood: 'Chill Luxe',
    totalOrders: 1247,
    totalSpent: 89450,
    growth: '+23%',
    emoji: '🧘‍♀️'
  },
  {
    mood: 'Confident Boss',
    totalOrders: 1089,
    totalSpent: 125600,
    growth: '+18%',
    emoji: '💪'
  },
  {
    mood: 'Romantic Dreamer',
    totalOrders: 892,
    totalSpent: 67800,
    growth: '+15%',
    emoji: '💕'
  },
  {
    mood: 'Adventure Ready',
    totalOrders: 756,
    totalSpent: 45200,
    growth: '+12%',
    emoji: '🌍'
  },
  {
    mood: 'Elegant Minimalist',
    totalOrders: 634,
    totalSpent: 78900,
    growth: '+8%',
    emoji: '✨'
  }
];

export const useMoodStore = create<MoodState>((set, get) => ({
  currentMood: null,
  moodLeaderboard: mockMoodLeaderboard,
  detectedMood: null,
  moodHistory: [],

  setCurrentMood: (mood: string) => {
    set({ currentMood: mood });
  },

  setDetectedMood: (mood: string, confidence: number) => {
    set({ detectedMood: mood });
    get().addMoodEntry(mood, confidence, 'Live detection');
  },

  addMoodEntry: (mood: string, confidence: number, context?: string) => {
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood,
      confidence,
      context
    };

    set(state => ({
      moodHistory: [newEntry, ...state.moodHistory.slice(0, 49)] // Keep last 50 entries
    }));
  },

  getMoodLeaderboard: () => {
    return get().moodLeaderboard;
  }
}));