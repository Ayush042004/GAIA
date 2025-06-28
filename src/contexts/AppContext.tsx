import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, StudyMaterial, StudySession, StudyRoom, AuthState, Quiz, QuizAttempt } from '../types';

interface AppState {
  user: User | null;
  studyMaterials: StudyMaterial[];
  studySessions: StudySession[];
  studyRooms: StudyRoom[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  currentRoom: StudyRoom | null;
  isLoading: boolean;
  activeView: 'dashboard' | 'upload' | 'sessions' | 'whiteboard' | 'analytics' | 'quiz' | 'leaderboard';
  auth: AuthState;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_STUDY_MATERIAL'; payload: StudyMaterial }
  | { type: 'ADD_STUDY_SESSION'; payload: StudySession }
  | { type: 'ADD_STUDY_ROOM'; payload: StudyRoom }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'ADD_QUIZ_ATTEMPT'; payload: QuizAttempt }
  | { type: 'JOIN_STUDY_ROOM'; payload: { roomId: string; user: User } }
  | { type: 'LEAVE_STUDY_ROOM'; payload: { roomId: string; userId: string } }
  | { type: 'JOIN_STUDY_SESSION'; payload: { sessionId: string; user: User } }
  | { type: 'SET_CURRENT_ROOM'; payload: StudyRoom | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_VIEW'; payload: AppState['activeView'] }
  | { type: 'UPDATE_STUDY_MATERIAL'; payload: { id: string; updates: Partial<StudyMaterial> } }
  | { type: 'UPDATE_QUIZ'; payload: { id: string; updates: Partial<Quiz> } }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }
  | { type: 'SET_AUTH_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  studyMaterials: [],
  studySessions: [],
  quizzes: [],
  quizAttempts: [],
  studyRooms: [
    {
      id: 'room-1',
      name: 'Advanced Mathematics',
      description: 'Calculus, Linear Algebra, and Statistics study group',
      participants: [],
      maxParticipants: 8,
      isActive: true,
      createdAt: new Date(),
      whiteboardElements: [],
      isPublic: true,
      joinCode: 'MATH2024',
      createdBy: 'system',
      tags: ['mathematics', 'calculus', 'algebra']
    },
    {
      id: 'room-2',
      name: 'Physics Lab Prep',
      description: 'Preparing for physics laboratory experiments',
      participants: [],
      maxParticipants: 6,
      isActive: true,
      createdAt: new Date(),
      whiteboardElements: [],
      isPublic: true,
      joinCode: 'PHYS2024',
      createdBy: 'system',
      tags: ['physics', 'laboratory', 'experiments']
    },
    {
      id: 'room-3',
      name: 'Computer Science Algorithms',
      description: 'Data structures, algorithms, and coding practice',
      participants: [],
      maxParticipants: 10,
      isActive: true,
      createdAt: new Date(),
      whiteboardElements: [],
      isPublic: true,
      joinCode: 'CS2024',
      createdBy: 'system',
      tags: ['computer science', 'algorithms', 'coding']
    }
  ],
  currentRoom: null,
  isLoading: false,
  activeView: 'dashboard',
  auth: {
    isAuthenticated: false,
    isLoading: false,
    error: null
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_STUDY_MATERIAL':
      return { ...state, studyMaterials: [...state.studyMaterials, action.payload] };
    case 'ADD_STUDY_SESSION':
      return { ...state, studySessions: [...state.studySessions, action.payload] };
    case 'ADD_STUDY_ROOM':
      return { ...state, studyRooms: [...state.studyRooms, action.payload] };
    case 'ADD_QUIZ':
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    case 'ADD_QUIZ_ATTEMPT':
      return { ...state, quizAttempts: [...state.quizAttempts, action.payload] };
    case 'JOIN_STUDY_ROOM':
      return {
        ...state,
        studyRooms: state.studyRooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, participants: [...room.participants.filter(p => p.id !== action.payload.user.id), action.payload.user] }
            : room
        )
      };
    case 'LEAVE_STUDY_ROOM':
      return {
        ...state,
        studyRooms: state.studyRooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, participants: room.participants.filter(p => p.id !== action.payload.userId) }
            : room
        )
      };
    case 'JOIN_STUDY_SESSION':
      return {
        ...state,
        studySessions: state.studySessions.map(session =>
          session.id === action.payload.sessionId
            ? { ...session, participants: [...session.participants.filter(p => p.id !== action.payload.user.id), action.payload.user] }
            : session
        )
      };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'UPDATE_STUDY_MATERIAL':
      return {
        ...state,
        studyMaterials: state.studyMaterials.map(material =>
          material.id === action.payload.id
            ? { ...material, ...action.payload.updates }
            : material
        )
      };
    case 'UPDATE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === action.payload.id
            ? { ...quiz, ...action.payload.updates }
            : quiz
        )
      };
    case 'SET_AUTH_LOADING':
      return {
        ...state,
        auth: { ...state.auth, isLoading: action.payload }
      };
    case 'SET_AUTH_ERROR':
      return {
        ...state,
        auth: { ...state.auth, error: action.payload }
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        auth: {
          isAuthenticated: true,
          isLoading: false,
          error: null
        }
      };
    case 'LOGOUT':
      return {
        ...initialState,
        studyRooms: state.studyRooms, // Keep public rooms
        auth: {
          isAuthenticated: false,
          isLoading: false,
          error: null
        }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}