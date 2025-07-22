import React, { useState } from 'react';
import { Activity, Zap } from 'lucide-react';
import { BiometricData, Theme } from '../types';
import { generateMockBiometricData } from '../utils/chakraCalculator';

interface BiometricInputProps {
  onDataInput: (data: BiometricData) => void;
  theme: Theme;
}

export function BiometricInput({ onDataInput, theme }: BiometricInputProps) {
  const isDark = theme === 'dark';

  const handleGenerateData = () => {
    const mockData = generateMockBiometricData();
    onDataInput(mockData);
  };

  return (
    <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
      isDark 
        ? 'bg-gray-800/80 border border-purple-500/30' 
        : 'bg-white/80 border border-purple-200/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-600' : 'bg-purple-100'}`}>
          <Activity className={`w-6 h-6 ${isDark ? 'text-white' : 'text-purple-600'}`} />
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Biometric Input
        </h2>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Connect Your Sensors
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect your biometric sensors (HRV monitor, GSR sensor, temperature sensor, EEG headband) 
            to start receiving real-time data for chakra analysis.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>HRV Monitor</span>
            </div>
            <div className={`p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>GSR Sensor</span>
            </div>
            <div className={`p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Temperature</span>
            </div>
            <div className={`p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>EEG Headband</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateData}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Generate Sample Data</span>
        </button>

        <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Use sample data for demonstration purposes
        </p>
      </div>
    </div>
  );
}