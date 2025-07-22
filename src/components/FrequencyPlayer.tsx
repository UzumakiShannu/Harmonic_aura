import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Clock, SkipForward } from 'lucide-react';
import { ChakraData, Theme } from '../types';

interface FrequencyPlayerProps {
  chakraData: ChakraData[];
  theme: Theme;
  isSessionActive: boolean;
}

// Healing frequencies for each chakra with recommended healing times
const CHAKRA_FREQUENCIES = {
  Root: { frequency: 396, name: 'Root Chakra - Grounding', color: '#DC2626', healingTime: 300 }, // 5 minutes
  Sacral: { frequency: 417, name: 'Sacral Chakra - Creativity', color: '#EA580C', healingTime: 360 }, // 6 minutes
  SolarPlexus: { frequency: 528, name: 'Solar Plexus - Personal Power', color: '#CA8A04', healingTime: 420 }, // 7 minutes
  Heart: { frequency: 639, name: 'Heart Chakra - Love & Connection', color: '#16A34A', healingTime: 480 }, // 8 minutes
  Throat: { frequency: 741, name: 'Throat Chakra - Expression', color: '#2563EB', healingTime: 300 }, // 5 minutes
  ThirdEye: { frequency: 852, name: 'Third Eye - Intuition', color: '#7C3AED', healingTime: 600 }, // 10 minutes
  Crown: { frequency: 963, name: 'Crown Chakra - Spiritual Connection', color: '#9333EA', healingTime: 720 } // 12 minutes
};

export function FrequencyPlayer({ chakraData, theme, isSessionActive }: FrequencyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [currentChakra, setCurrentChakra] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [currentChakraIndex, setCurrentChakraIndex] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === 'dark';

  // Get unbalanced chakras
  const unbalancedChakras = chakraData.filter(chakra => chakra.status !== 'Balanced');

  useEffect(() => {
    return () => {
      stopFrequency();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Timer countdown
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up for current chakra
            if (currentChakraIndex < unbalancedChakras.length - 1) {
              // Move to next chakra
              const nextIndex = currentChakraIndex + 1;
              const nextChakra = unbalancedChakras[nextIndex];
              const nextFreq = CHAKRA_FREQUENCIES[nextChakra.name as keyof typeof CHAKRA_FREQUENCIES];
              
              setCurrentChakraIndex(nextIndex);
              playFrequency(nextFreq.frequency, nextChakra.name, nextFreq.healingTime);
              return nextFreq.healingTime;
            } else {
              // All chakras completed
              stopFrequency();
              setCurrentChakraIndex(0);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, currentChakraIndex, unbalancedChakras]);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playFrequency = async (frequency: number, chakraName?: string, duration?: number) => {
    try {
      const audioContext = initAudioContext();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Stop any existing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }

      // Create new oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(isMuted ? 0 : volume, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      setCurrentFrequency(frequency);
      setCurrentChakra(chakraName || null);
      setIsPlaying(true);

      // Set timer if duration is provided
      if (duration) {
        setTimeRemaining(duration);
        setTotalTime(duration);
      }

    } catch (error) {
      console.error('Error playing frequency:', error);
    }
  };

  const stopFrequency = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setCurrentFrequency(null);
    setCurrentChakra(null);
    setTimeRemaining(0);
    setTotalTime(0);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopFrequency();
    } else if (unbalancedChakras.length > 0) {
      // Start with first unbalanced chakra
      const firstChakra = unbalancedChakras[0];
      const freq = CHAKRA_FREQUENCIES[firstChakra.name as keyof typeof CHAKRA_FREQUENCIES];
      setCurrentChakraIndex(0);
      playFrequency(freq.frequency, firstChakra.name, freq.healingTime);
    }
  };

  const skipToNext = () => {
    if (unbalancedChakras.length > 0 && currentChakraIndex < unbalancedChakras.length - 1) {
      const nextIndex = currentChakraIndex + 1;
      const nextChakra = unbalancedChakras[nextIndex];
      const nextFreq = CHAKRA_FREQUENCIES[nextChakra.name as keyof typeof CHAKRA_FREQUENCIES];
      
      setCurrentChakraIndex(nextIndex);
      playFrequency(nextFreq.frequency, nextChakra.name, nextFreq.healingTime);
    }
  };

  const playSpecificChakra = (chakraName: string) => {
    const freq = CHAKRA_FREQUENCIES[chakraName as keyof typeof CHAKRA_FREQUENCIES];
    const chakraIndex = unbalancedChakras.findIndex(c => c.name === chakraName);
    if (chakraIndex !== -1) {
      setCurrentChakraIndex(chakraIndex);
    }
    playFrequency(freq.frequency, chakraName, freq.healingTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current!.currentTime);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newMuted ? 0 : volume, 
        audioContextRef.current!.currentTime
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
      isDark 
        ? 'bg-gray-800/80 border border-purple-500/30' 
        : 'bg-white/80 border border-purple-200/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-600' : 'bg-purple-100'}`}>
          <Music className={`w-6 h-6 ${isDark ? 'text-white' : 'text-purple-600'}`} />
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Healing Frequencies
        </h2>
      </div>

      {unbalancedChakras.length > 0 ? (
        <div className="space-y-6">
          {/* Current Playing Display */}
          {isPlaying && currentChakra && (
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Now Playing
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentChakra.replace(/([A-Z])/g, ' $1').trim()} - {currentFrequency} Hz
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              
              {/* Sound Wave Animation */}
              <div className="flex items-center justify-center space-x-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded animate-pulse"
                    style={{ 
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Player Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={togglePlay}
                disabled={unbalancedChakras.length === 0}
                className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white shadow-lg`}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              {isPlaying && currentChakraIndex < unbalancedChakras.length - 1 && (
                <button
                  onClick={skipToNext}
                  className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isMuted ? 
                  <VolumeX className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} /> :
                  <Volume2 className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                }
              </button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Healing Queue */}
          <div>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Healing Queue ({unbalancedChakras.length} chakras)
            </h4>
            <div className="space-y-2">
              {unbalancedChakras.map((chakra, index) => {
                const freq = CHAKRA_FREQUENCIES[chakra.name as keyof typeof CHAKRA_FREQUENCIES];
                const isCurrentlyPlaying = isPlaying && currentChakra === chakra.name;
                const isCompleted = isPlaying && index < currentChakraIndex;
                const isNext = index === currentChakraIndex && !isPlaying;
                
                return (
                  <div
                    key={chakra.name}
                    className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                      isCurrentlyPlaying 
                        ? isDark ? 'bg-purple-900/50 border-purple-500' : 'bg-purple-100 border-purple-300'
                        : isCompleted
                        ? isDark ? 'bg-green-900/30 border-green-500/30' : 'bg-green-50 border-green-200'
                        : isNext
                        ? isDark ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                        : isDark ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => !isPlaying && playSpecificChakra(chakra.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            isCurrentlyPlaying ? 'bg-purple-500 text-white' :
                            isCompleted ? 'bg-green-500 text-white' :
                            isNext ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {index + 1}
                          </span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: chakra.color }}
                          />
                        </div>
                        <div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {chakra.name.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatTime(freq.healingTime)} healing session
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                          {freq.frequency} Hz
                        </div>
                        <div className={`text-xs ${
                          chakra.status === 'Underactive' ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                          {chakra.status}
                        </div>
                      </div>
                    </div>
                    
                    {isCurrentlyPlaying && (
                      <div className="mt-2">
                        <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div
                            className="h-full bg-purple-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${getProgress()}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session Info */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
            <h4 className={`font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Healing Session Info
            </h4>
            <div className={`text-sm space-y-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              <p>• Total healing time: {formatTime(unbalancedChakras.reduce((total, chakra) => {
                const freq = CHAKRA_FREQUENCIES[chakra.name as keyof typeof CHAKRA_FREQUENCIES];
                return total + freq.healingTime;
              }, 0))}</p>
              <p>• Each frequency plays for its optimal healing duration</p>
              <p>• You can skip to the next chakra or play specific frequencies</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Music className="w-12 h-12 mx-auto opacity-50 mb-4" />
          <p>All chakras are balanced!</p>
          <p className="text-sm mt-2">No healing frequencies needed at this time.</p>
        </div>
      )}
    </div>
  );
}