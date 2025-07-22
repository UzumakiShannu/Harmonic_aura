import { BiometricData, ChakraData } from '../types';

// Normalization ranges for biosensor data
const RANGES = {
  HRV: { min: 10, max: 100 },
  GSR: { min: 0.1, max: 10 },
  TEMP: { min: 95, max: 102 },
  EEG_ALPHA: { min: 8, max: 13 },
  EEG_BETA: { min: 13, max: 30 },
  EEG_THETA: { min: 4, max: 8 }
};

// Chakra weights for BES calculation
const CHAKRA_WEIGHTS = {
  Root: { HRV: 0.3, GSR: 0.4, TEMP: 0.3, EEG_ALPHA: 0.0, EEG_BETA: 0.0, EEG_THETA: 0.0 },
  Sacral: { HRV: 0.2, GSR: 0.3, TEMP: 0.2, EEG_ALPHA: 0.1, EEG_BETA: 0.1, EEG_THETA: 0.1 },
  SolarPlexus: { HRV: 0.25, GSR: 0.35, TEMP: 0.15, EEG_ALPHA: 0.1, EEG_BETA: 0.1, EEG_THETA: 0.05 },
  Heart: { HRV: 0.5, GSR: 0.2, TEMP: 0.1, EEG_ALPHA: 0.1, EEG_BETA: 0.05, EEG_THETA: 0.05 },
  Throat: { HRV: 0.1, GSR: 0.1, TEMP: 0.1, EEG_ALPHA: 0.3, EEG_BETA: 0.3, EEG_THETA: 0.1 },
  ThirdEye: { HRV: 0.05, GSR: 0.05, TEMP: 0.05, EEG_ALPHA: 0.35, EEG_BETA: 0.25, EEG_THETA: 0.25 },
  Crown: { HRV: 0.05, GSR: 0.05, TEMP: 0.05, EEG_ALPHA: 0.25, EEG_BETA: 0.15, EEG_THETA: 0.45 }
};

const CHAKRA_COLORS = {
  Root: '#DC2626',
  Sacral: '#EA580C',
  SolarPlexus: '#CA8A04',
  Heart: '#16A34A',
  Throat: '#2563EB',
  ThirdEye: '#7C3AED',
  Crown: '#9333EA'
};

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function calculateBES(data: BiometricData, weights: Record<string, number>): number {
  const normalized = {
    HRV: normalize(data.HRV, RANGES.HRV.min, RANGES.HRV.max),
    GSR: normalize(data.GSR, RANGES.GSR.min, RANGES.GSR.max),
    TEMP: normalize(data.TEMP, RANGES.TEMP.min, RANGES.TEMP.max),
    EEG_ALPHA: normalize(data.EEG_ALPHA, RANGES.EEG_ALPHA.min, RANGES.EEG_ALPHA.max),
    EEG_BETA: normalize(data.EEG_BETA, RANGES.EEG_BETA.min, RANGES.EEG_BETA.max),
    EEG_THETA: normalize(data.EEG_THETA, RANGES.EEG_THETA.min, RANGES.EEG_THETA.max)
  };

  return Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (normalized[key as keyof typeof normalized] * weight);
  }, 0) * 100;
}

function classifyStatus(score: number): 'Underactive' | 'Balanced' | 'Overactive' {
  if (score < 40) return 'Underactive';
  if (score > 70) return 'Overactive';
  return 'Balanced';
}

export function calculateChakraData(data: BiometricData): ChakraData[] {
  return Object.entries(CHAKRA_WEIGHTS).map(([name, weights]) => {
    const score = calculateBES(data, weights);
    const status = classifyStatus(score);
    
    return {
      name,
      score: Math.round(score),
      status,
      color: CHAKRA_COLORS[name as keyof typeof CHAKRA_COLORS]
    };
  });
}

export function generateRecommendations(chakras: ChakraData[]): string[] {
  const recommendations: string[] = [];
  
  chakras.forEach(chakra => {
    if (chakra.status === 'Underactive') {
      switch (chakra.name) {
        case 'Root':
          recommendations.push('Activate grounding motor in wristband for 5 minutes');
          recommendations.push('Play 396 Hz binaural beat for root chakra activation');
          break;
        case 'Sacral':
          recommendations.push('Play 417 Hz frequency for emotional healing');
          recommendations.push('Gentle warmth therapy for sacral region');
          break;
        case 'SolarPlexus':
          recommendations.push('Play 528 Hz tone for personal power activation');
          recommendations.push('Deep breathing exercises with yellow light visualization');
          break;
        case 'Heart':
          recommendations.push('Heart coherence breathing pattern (5 seconds in, 5 seconds out)');
          recommendations.push('Play 639 Hz frequency for heart opening');
          break;
        case 'Throat':
          recommendations.push('Humming vibration therapy for throat chakra');
          recommendations.push('Play 741 Hz frequency for expression enhancement');
          break;
        case 'ThirdEye':
          recommendations.push('Increase alpha wave stimulation through meditation');
          recommendations.push('Play 852 Hz frequency for intuition development');
          break;
        case 'Crown':
          recommendations.push('Deep theta meditation session recommended');
          recommendations.push('Play 963 Hz frequency for spiritual connection');
          break;
      }
    } else if (chakra.status === 'Overactive') {
      recommendations.push(`Balance ${chakra.name} chakra through gentle cooling therapy`);
      recommendations.push(`Reduce stimulation and practice grounding exercises`);
    }
  });
  
  return recommendations;
}

export function generateMockBiometricData(): BiometricData {
  return {
    HRV: Math.random() * 90 + 10,
    GSR: Math.random() * 9.9 + 0.1,
    TEMP: Math.random() * 7 + 95,
    EEG_ALPHA: Math.random() * 5 + 8,
    EEG_BETA: Math.random() * 17 + 13,
    EEG_THETA: Math.random() * 4 + 4,
    timestamp: new Date().toISOString()
  };
}