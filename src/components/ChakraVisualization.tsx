import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChakraData, Theme } from '../types';
import { Eye } from 'lucide-react';

interface ChakraVisualizationProps {
  chakraData: ChakraData[];
  theme: Theme;
}

export function ChakraVisualization({ chakraData, theme }: ChakraVisualizationProps) {
  const isDark = theme === 'dark';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Underactive': return '#DC2626';
      case 'Balanced': return '#16A34A';
      case 'Overactive': return '#CA8A04';
      default: return '#6B7280';
    }
  };

  const radarData = chakraData.map(chakra => ({
    chakra: chakra.name.replace(/([A-Z])/g, ' $1').trim(),
    score: chakra.score,
    fullMark: 100
  }));

  return (
    <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
      isDark 
        ? 'bg-gray-800/80 border border-purple-500/30' 
        : 'bg-white/80 border border-purple-200/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-600' : 'bg-purple-100'}`}>
          <Eye className={`w-6 h-6 ${isDark ? 'text-white' : 'text-purple-600'}`} />
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Chakra Analysis
        </h2>
      </div>

      {chakraData.length > 0 ? (
        <>
          {/* Radar Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <PolarAngleAxis 
                  dataKey="chakra" 
                  tick={{ 
                    fill: isDark ? '#D1D5DB' : '#374151', 
                    fontSize: 12,
                    fontWeight: 'medium'
                  }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ 
                    fill: isDark ? '#9CA3AF' : '#6B7280', 
                    fontSize: 10 
                  }}
                />
                <Radar
                  name="BES Score"
                  dataKey="score"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Indicators */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Bio-Field Status
            </h3>
            {chakraData.map((chakra, index) => (
              <div
                key={chakra.name}
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50/50 border-gray-200'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: chakra.color }}
                    />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {chakra.name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {chakra.score}
                    </div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: getStatusColor(chakra.status) }}
                    >
                      {chakra.status}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      backgroundColor: getStatusColor(chakra.status),
                      width: `${chakra.score}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="mb-4">
            <Eye className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p>Input biometric data to see your chakra analysis</p>
        </div>
      )}
    </div>
  );
}