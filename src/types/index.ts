export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'txt' | 'image';
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  summary?: string;
  questions?: Question[];
  tags?: string[];
  content?: string;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'error';
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: Date;
  createdBy: string;
  timeLimit?: number; // in minutes
  totalQuestions: number;
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  syllabus?: StudyMaterial;
  isActive: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { questionId: string; selectedAnswer: number }[];
  score: number;
  totalPoints: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
}

export interface StudySession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  participants: User[];
  materials: StudyMaterial[];
  status: 'scheduled' | 'active' | 'completed';
  createdBy: string;
  roomId?: string;
  maxParticipants?: number;
  isPublic?: boolean;
  joinCode?: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  strokeWidth: number;
  content?: string;
  points?: { x: number; y: number }[];
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  participants: User[];
  maxParticipants: number;
  isActive: boolean;
  createdAt: Date;
  whiteboardElements: WhiteboardElement[];
  isPublic: boolean;
  joinCode: string;
  createdBy: string;
  tags?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}