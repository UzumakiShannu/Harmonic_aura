import React, { useState, useEffect } from 'react';
import { User, Settings, Moon, Sun, LogOut, Activity } from 'lucide-react';
import { User as UserType, BiometricData, SessionData, Theme } from '../types';
import { BiometricInput } from './BiometricInput';
import { ChakraVisualization } from './ChakraVisualization';
import { TherapySection } from './TherapySection';
import { SessionComparison } from './SessionComparison';
import { FrequencyPlayer } from './FrequencyPlayer';
import { calculateChakraData, generateRecommendations, generateMockBiometricData } from '../utils/chakraCalculator';

interface DashboardProps {
  user: UserType;
  theme: Theme;
  onThemeToggle: () => void;
  onSignOut: () => void;
}

// Helper function to ensure biometric data has correct types
const normalizeBiometricData = (data: any): BiometricData => {
  return {
    HRV: Number(data.HRV),
    GSR: Number(data.GSR),
    TEMP: Number(data.TEMP),
    EEG_ALPHA: Number(data.EEG_ALPHA),
    EEG_BETA: Number(data.EEG_BETA),
    EEG_THETA: Number(data.EEG_THETA),
    timestamp: data.timestamp
  };
};

// Helper function to normalize session data
const normalizeSessionData = (session: any): SessionData => {
  return {
    ...session,
    before: normalizeBiometricData(session.before),
    after: session.after ? normalizeBiometricData(session.after) : undefined
  };
};

export function Dashboard({ user, theme, onThemeToggle, onSignOut }: DashboardProps) {
  const [currentData, setCurrentData] = useState<BiometricData | null>(null);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem(`sessions_${user.id}`);
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Normalize the data types for all sessions
        const normalizedSessions = parsedSessions.map(normalizeSessionData);
        setSessions(normalizedSessions);
      } catch (error) {
        console.error('Error parsing saved sessions:', error);
        setSessions([]);
      }
    }
  }, [user.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMode) {
      interval = setInterval(() => {
        setCurrentData(generateMockBiometricData());
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLiveMode]);

  const handleDataInput = (data: BiometricData) => {
    setCurrentData(data);
  };

  const startSession = () => {
    if (!currentData) return;

    const session: SessionData = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      before: currentData,
      chakrasBefore: calculateChakraData(currentData),
      startTime: new Date().toISOString(),
      recommendations: generateRecommendations(calculateChakraData(currentData))
    };

    setActiveSession(session);
  };

  const endSession = () => {
    if (!activeSession || !currentData) return;

    const updatedSession: SessionData = {
      ...activeSession,
      after: currentData,
      chakrasAfter: calculateChakraData(currentData),
      endTime: new Date().toISOString()
    };

    const updatedSessions = [updatedSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem(`sessions_${user.id}`, JSON.stringify(updatedSessions));
    setActiveSession(null);
  };

  const chakraData = currentData ? calculateChakraData(currentData) : [];
  const recommendations = currentData ? generateRecommendations(chakraData) : [];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-lg sticky top-0 z-50 ${
        isDark 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-purple-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-purple-600' : 'bg-purple-100'
              }`}>
                <Activity className={`w-6 h-6 ${isDark ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Harmonic Aura
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back, {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isLiveMode 
                    ? 'bg-green-500 text-white' 
                    : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isLiveMode ? 'Live Mode ON' : 'Live Mode OFF'}
              </button>
              
              <button
                onClick={onThemeToggle}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              <button
                onClick={onSignOut}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <LogOut className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <BiometricInput onDataInput={handleDataInput} theme={theme} />
            <FrequencyPlayer 
              chakraData={chakraData}
              theme={theme}
              isSessionActive={!!activeSession}
            />
          </div>

          {/* Center Column */}
          <div className="space-y-8">
            <ChakraVisualization chakraData={chakraData} theme={theme} />
            <TherapySection 
              recommendations={recommendations}
              onStartSession={startSession}
              onEndSession={endSession}
              activeSession={activeSession}
              theme={theme}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <SessionComparison 
              sessions={sessions}
              activeSession={activeSession}
              theme={theme}
            />
          </div>
        </div>
      </main>
    </div>
  );
}