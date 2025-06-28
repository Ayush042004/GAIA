import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isTransitioning: boolean;
}

type ThemeAction = 
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_TRANSITIONING'; payload: boolean };

const initialState: ThemeState = {
  theme: 'light',
  isTransitioning: false
};

const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
  triggerTransition: (buttonRect: DOMRect) => void;
} | null>(null);

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_TRANSITIONING':
      return { ...state, isTransitioning: action.payload };
    default:
      return state;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const transitionOriginRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  const triggerTransition = (buttonRect: DOMRect) => {
    // Calculate the center of the button relative to the viewport
    const x = buttonRect.left + buttonRect.width / 2;
    const y = buttonRect.top + buttonRect.height / 2;
    
    // Convert to percentage for CSS
    const xPercent = (x / window.innerWidth) * 100;
    const yPercent = (y / window.innerHeight) * 100;
    
    transitionOriginRef.current = { x: xPercent, y: yPercent };
    
    // Start transition
    dispatch({ type: 'SET_TRANSITIONING', payload: true });
    
    // Apply theme class immediately for instant color change
    setTimeout(() => {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }, 50);
    
    // End transition after animation completes
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_TRANSITIONING', payload: false });
      transitionOriginRef.current = null;
    }, 600);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  return (
    <ThemeContext.Provider value={{ state, dispatch, triggerTransition }}>
      {children}
      {/* Subtle ripple effect only - no overlay */}
      {state.isTransitioning && transitionOriginRef.current && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Primary ripple effect from button */}
          <div 
            className="absolute w-4 h-4 rounded-full bg-purple-400/30 dark:bg-yellow-400/30"
            style={{
              left: `${transitionOriginRef.current.x}%`,
              top: `${transitionOriginRef.current.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: 'rippleEffect 0.6s ease-out forwards'
            }}
          />
          
          {/* Secondary smaller ripple for depth */}
          <div 
            className="absolute w-2 h-2 rounded-full bg-purple-500/40 dark:bg-yellow-500/40"
            style={{
              left: `${transitionOriginRef.current.x}%`,
              top: `${transitionOriginRef.current.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: 'rippleEffect 0.4s ease-out 0.1s forwards'
            }}
          />
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}