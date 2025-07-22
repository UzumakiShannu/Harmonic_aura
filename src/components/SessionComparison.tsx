import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import { SessionData, Theme } from '../types';

interface SessionComparisonProps {
  sessions: SessionData[];
  activeSession: SessionData | null;
  theme: Theme;
}

export function SessionComparison({ sessions, activeSession, theme }: SessionComparisonProps) {
  const isDark = theme === 'dark';
  const completedSessions = sessions.filter(s => s.after && s.chakrasAfter);

  const getComparisonData = (session: SessionData) => {
    if (!session.after || !session.chakrasAfter) return [];
    
    return [
      {
        metric: 'HRV',
        before: Number(session.before.HRV.toFixed(1)),
        after: Number(session.after.HRV.toFixed(1))
      },
      {
        metric: 'GSR',
        before: Number(session.before.GSR.toFixed(1)),
        after: Number(session.after.GSR.toFixed(1))
      },
      {
        metric: 'TEMP',
        before: Number(session.before.TEMP.toFixed(1)),
        after: Number(session.after.TEMP.toFixed(1))
      }
    ];
  };

  const getBalancedChakrasCount = (session: SessionData) => {
    const beforeBalanced = session.chakrasBefore.filter(c => c.status === 'Balanced').length;
    const afterBalanced = session.chakrasAfter?.filter(c => c.status === 'Balanced').length || 0;
    return { before: beforeBalanced, after: afterBalanced };
  };

  return (
    <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
      isDark 
        ? 'bg-gray-800/80 border border-purple-500/30' 
        : 'bg-white/80 border border-purple-200/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-600' : 'bg-purple-100'}`}>
          <TrendingUp className={`w-6 h-6 ${isDark ? 'text-white' : 'text-purple-600'}`} />
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Session Progress
        </h2>
      </div>

      {activeSession && (
        <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-blue-900/50 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Current Session
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className={`w-4 h-4 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
            <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>
              Started {new Date(activeSession.startTime).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {completedSessions.length > 0 ? (
        <div className="space-y-6">
          {/* Latest Session Comparison */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Latest Session Results
            </h3>
            
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getComparisonData(completedSessions[0])}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="metric" 
                    tick={{ fill: isDark ? '#D1D5DB' : '#374151', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      color: isDark ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Bar dataKey="before" fill="#DC2626" name="Before" />
                  <Bar dataKey="after" fill="#16A34A" name="After" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chakra Balance Improvement */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Chakra Balance Improvement
              </h4>
              {(() => {
                const { before, after } = getBalancedChakrasCount(completedSessions[0]);
                const improvement = after - before;
                return (
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Balanced Chakras: {before} → {after}
                    </span>
                    <span className={`text-sm font-bold ${
                      improvement > 0 ? 'text-green-500' : improvement < 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Session History */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Recent Sessions
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {completedSessions.slice(0, 5).map((session, index) => {
                const { before, after } = getBalancedChakrasCount(session);
                const improvement = after - before;
                
                return (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                      isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {new Date(session.startTime).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${
                        improvement > 0 ? 'text-green-500' : improvement < 0 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {improvement > 0 ? '+' : ''}{improvement}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <TrendingUp className="w-12 h-12 mx-auto opacity-50 mb-4" />
          <p>Complete therapy sessions to see your progress</p>
        </div>
      )}
    </div>
  );
}