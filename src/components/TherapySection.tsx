import React from 'react';
import { Play, Square, Heart, Zap } from 'lucide-react';
import { SessionData, Theme } from '../types';

interface TherapySectionProps {
  recommendations: string[];
  onStartSession: () => void;
  onEndSession: () => void;
  activeSession: SessionData | null;
  theme: Theme;
}

export function TherapySection({ 
  recommendations, 
  onStartSession, 
  onEndSession, 
  activeSession, 
  theme 
}: TherapySectionProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
      isDark 
        ? 'bg-gray-800/80 border border-purple-500/30' 
        : 'bg-white/80 border border-purple-200/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-600' : 'bg-purple-100'}`}>
          <Heart className={`w-6 h-6 ${isDark ? 'text-white' : 'text-purple-600'}`} />
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Therapy Recommendations
        </h2>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-4 mb-6">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
              }`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-start space-x-3">
                <Zap className={`w-5 h-5 mt-0.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Heart className="w-12 h-12 mx-auto opacity-50 mb-4" />
          <p>Process biometric data to receive personalized therapy recommendations</p>
        </div>
      )}

      {/* Session Controls */}
      <div className="space-y-4">
        {!activeSession ? (
          <button
            onClick={onStartSession}
            disabled={recommendations.length === 0}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <Play className="w-5 h-5" />
            <span>Start Therapy Session</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-green-900/50 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  Session Active
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                Started at {new Date(activeSession.startTime).toLocaleTimeString()}
              </p>
            </div>
            
            <button
              onClick={onEndSession}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
            >
              <Square className="w-5 h-5" />
              <span>End Session</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}