'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { X, Play, Pause, FastForward, CheckCircle2 } from 'lucide-react';

type Scene = {
  id: string;
  path: string;
  targetId?: string;
  targetPosition?: { x: number; y: number };
  tooltipText: string;
  tooltipTitle?: string;
  duration: number;
  action?: () => void;
  prepare?: () => void;
};

export function ProductTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [tooltipPos, setTooltipPos] = useState({ x: -1000, y: -1000 });
  
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenes: Scene[] = useMemo(() => [
    {
      id: 'landing',
      path: '/',
      targetId: 'tour-start-tracking',
      tooltipTitle: 'Welcome to FinTrack',
      tooltipText: "Let's see how you can take control of your finances in less than a minute.",
      duration: 5000,
      action: () => router.push('/dashboard'),
    },
    {
      id: 'dashboard-empty',
      path: '/dashboard',
      targetId: 'tour-seed-data',
      tooltipTitle: 'First-Time Dashboard',
      tooltipText: "New users can either add transactions manually or instantly explore the platform with demo data.",
      duration: 5000,
      action: () => {
        // We'll simulate clicking seed data.
        // For the demo, we can just navigate to a query param that shows mock data or simulate it.
        // To make it visually impressive, we can just let the real seed button be clicked or fake the loading.
        // Actually, let's just trigger the real seed data button by clicking it programmatically.
        const el = document.getElementById('tour-seed-data');
        if (el) (el as HTMLElement).click();
      }
    },
    {
      id: 'dashboard-loaded',
      path: '/dashboard',
      targetId: 'tour-dashboard-metrics', // We need to add this ID
      tooltipTitle: 'Dashboard Comes Alive',
      tooltipText: "Within seconds, FinTrack transforms raw transactions into meaningful financial insights.",
      duration: 6000,
    },
    {
      id: 'navbar-tour',
      path: '/dashboard',
      targetId: 'tour-nav', // ID on the floating navbar
      tooltipTitle: 'Floating Navigation',
      tooltipText: "Everything important is available from a single floating navigation bar.",
      duration: 5000,
      action: () => router.push('/analytics'),
    },
    {
      id: 'analytics',
      path: '/analytics',
      targetId: 'tour-analytics-charts',
      tooltipTitle: 'Analytics Visualization',
      tooltipText: "Visual analytics help users understand exactly where their money goes.",
      duration: 6000,
      action: () => router.push('/insights'),
    },
    {
      id: 'insights',
      path: '/insights',
      targetId: 'tour-generate-insights',
      tooltipTitle: 'AI Insights',
      tooltipText: "FinTrack uses AI to generate personalized financial recommendations based on spending behavior.",
      duration: 6000,
      action: () => {
        const el = document.getElementById('tour-generate-insights');
        if (el) (el as HTMLElement).click();
      }
    },
    {
      id: 'insights-results',
      path: '/insights',
      targetId: 'tour-insights-results',
      tooltipTitle: 'AI Recommendations',
      tooltipText: "Actionable recommendations like reducing dining expenses or building an emergency fund.",
      duration: 5000,
      action: () => router.push('/transactions'),
    },
    {
      id: 'transactions',
      path: '/transactions',
      targetId: 'tour-transactions-list',
      tooltipTitle: 'Transaction Management',
      tooltipText: "Every financial activity remains organized, searchable, and easy to review.",
      duration: 5000,
      action: () => {
        // Just move the cursor
      }
    },
    {
      id: 'bulk-actions',
      path: '/transactions',
      targetId: 'tour-bulk-actions',
      tooltipTitle: 'Bulk Operations & Export',
      tooltipText: "Select multiple transactions for quick bulk deletion, or export your filtered view to CSV.",
      duration: 5000,
    },
    {
      id: 'theme-switch',
      path: '/transactions',
      targetId: 'tour-theme-toggle',
      tooltipTitle: 'Theme Personalization',
      tooltipText: "Users can instantly personalize the experience with seamless theme switching.",
      duration: 4000,
      action: () => {
        setTheme('light');
        setTimeout(() => setTheme('dark'), 2000);
      }
    },
    {
      id: 'final',
      path: '/transactions', // Or keep it anywhere, we'll show a full screen modal
      tooltipTitle: 'Ready to Start?',
      tooltipText: "Join FinTrack today to build smarter money habits.",
      duration: 8000,
    }
  ], [router, setTheme]);

  useEffect(() => {
    // Restore state from sessionStorage if it exists
    const storedIsActive = sessionStorage.getItem('tour_isActive');
    const storedSceneIndex = sessionStorage.getItem('tour_sceneIndex');
    
    if (storedIsActive === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSceneIndex(storedSceneIndex ? parseInt(storedSceneIndex, 10) : 0);
    } else {
      const hasSeenTour = localStorage.getItem('fintrack_tour_seen');
      if (!hasSeenTour) {
        // Don't auto-start immediately to let the user see the landing page first
        const t = setTimeout(() => {
          setIsActive(true);
          sessionStorage.setItem('tour_isActive', 'true');
          sessionStorage.setItem('tour_sceneIndex', '0');
          localStorage.setItem('fintrack_tour_seen', 'true');
        }, 2000);
        return () => clearTimeout(t);
      }
    }
  }, []);

  useEffect(() => {
    const handleStartTour = () => {
      setIsActive(true);
      setCurrentSceneIndex(0);
      sessionStorage.setItem('tour_isActive', 'true');
      sessionStorage.setItem('tour_sceneIndex', '0');
      router.push('/');
    };

    window.addEventListener('start-product-tour', handleStartTour);
    return () => window.removeEventListener('start-product-tour', handleStartTour);
  }, [router]);

  // Update sessionStorage whenever state changes
  useEffect(() => {
    if (isActive) {
      sessionStorage.setItem('tour_sceneIndex', currentSceneIndex.toString());
    }
  }, [isActive, currentSceneIndex]);

  const startTour = () => {
    setIsActive(true);
    setCurrentSceneIndex(0);
    sessionStorage.setItem('tour_isActive', 'true');
    sessionStorage.setItem('tour_sceneIndex', '0');
    router.push('/');
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentSceneIndex(0);
    setIsPaused(false);
    sessionStorage.removeItem('tour_isActive');
    sessionStorage.removeItem('tour_sceneIndex');
  };

  // Main tour logic loop
  useEffect(() => {
    if (!isActive || isPaused) return;

    const scene = scenes[currentSceneIndex];
    if (!scene) return;

    // Make sure we are on the right path
    if (pathname !== scene.path) {
      router.push(scene.path);
      // We will wait for path to change before starting duration timer
      return;
    }

    // Run prepare function if any
    if (scene.prepare) {
      scene.prepare();
    }

    // Function to calculate and update positions
    const updatePositions = () => {
      if (scene.targetId) {
        const el = document.getElementById(scene.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Move cursor to center of element
          setCursorPos({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
          // Place tooltip below or above
          setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.bottom + 20,
          });
        } else {
          // Fallback to center screen
          setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setTooltipPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 + 50 });
        }
      } else if (scene.targetPosition) {
        setCursorPos(scene.targetPosition);
        setTooltipPos({ x: scene.targetPosition.x, y: scene.targetPosition.y + 50 });
      } else {
        // Center screen
        setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        setTooltipPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 + 50 });
      }
    };

    // Initial update
    updatePositions();

    // Sometimes elements load asynchronously, check again after a short delay
    const posTimeout = setTimeout(updatePositions, 500);

    timerRef.current = setTimeout(() => {
      // Execute scene action
      if (scene.action) {
        scene.action();
      }

      // Move to next scene
      if (currentSceneIndex < scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      } else {
        endTour();
      }
    }, scene.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(posTimeout);
    };
  }, [isActive, isPaused, currentSceneIndex, pathname, router, scenes]);

  if (!isActive) {
    return (
      <button 
        onClick={startTour}
        className="fixed bottom-4 left-4 z-50 hidden md:flex items-center rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-500 border border-cyan-500/20 backdrop-blur-sm transition-all hover:bg-cyan-500/20"
      >
        <Play className="inline-block w-4 h-4 mr-2" />
        Product Tour
      </button>
    );
  }

  const currentScene = scenes[currentSceneIndex];
  const isFinalScene = currentScene?.id === 'final';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-end">
      {/* Dark overlay to focus attention */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isFinalScene ? 0.8 : 0.2 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
      />

      {/* Simulated Cursor */}
      {!isFinalScene && (
        <motion.div
          animate={{ x: cursorPos.x, y: cursorPos.y }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, mass: 0.8 }}
          className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-[10000]"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="absolute w-full h-full bg-cyan-400 rounded-full opacity-30 animate-ping"></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_2px_rgba(6,182,212,0.8)] border-2 border-white"></div>
          </div>
        </motion.div>
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {!isFinalScene && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: Math.min(Math.max(20, tooltipPos.x - 150), typeof window !== "undefined" ? window.innerWidth - 320 : 0),
              top: Math.max(20, tooltipPos.y) 
            }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute z-[10000] w-[300px] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 border-b border-border">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                {currentScene.tooltipTitle}
              </h4>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">{currentScene.tooltipText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Summary Modal */}
      <AnimatePresence>
        {isFinalScene && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          >
            <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              
              <h2 className="text-3xl font-bold text-foreground mb-6">FinTrack Tour Complete</h2>
              
              <div className="space-y-4 mb-8">
                {[
                  'Track finances effortlessly',
                  'Visualize spending patterns',
                  'Receive AI-powered advice',
                  'Build smarter money habits'
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => endTour()}
                  className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-foreground transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Start Tracking Your Finances
                </button>
                <button 
                  onClick={() => {
                    endTour();
                    router.push('/dashboard');
                  }}
                  className="w-full rounded-full bg-accent text-accent-foreground px-6 py-3 font-medium transition-colors hover:bg-accent/80"
                >
                  Explore Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Controls (Bottom Bar) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 border-t border-border backdrop-blur-md pointer-events-auto flex items-center justify-between z-[10001]"
      >
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground">
            Guided Tour <span className="text-foreground">{currentSceneIndex + 1} / {scenes.length}</span>
          </div>
          <div className="h-2 w-48 bg-accent rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSceneIndex + 1) / scenes.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => {
              if (currentSceneIndex < scenes.length - 1) {
                if (timerRef.current) clearTimeout(timerRef.current);
                if (scenes[currentSceneIndex].action) scenes[currentSceneIndex].action!();
                setCurrentSceneIndex(prev => prev + 1);
              } else {
                endTour();
              }
            }}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
          >
            <FastForward className="w-5 h-5" />
          </button>
          <button 
            onClick={endTour}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
