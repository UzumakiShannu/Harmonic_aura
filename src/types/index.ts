export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  createdAt: string;
}

export interface BiometricData {
  HRV: number;
  GSR: number;
  TEMP: number;
  EEG_ALPHA: number;
  EEG_BETA: number;
  EEG_THETA: number;
  timestamp: string;
}

export interface ChakraData {
  name: string;
  score: number;
  status: 'Underactive' | 'Balanced' | 'Overactive';
  color: string;
}

export interface SessionData {
  id: string;
  userId: string;
  before: BiometricData;
  after?: BiometricData;
  chakrasBefore: ChakraData[];
  chakrasAfter?: ChakraData[];
  startTime: string;
  endTime?: string;
  recommendations: string[];
}

export type Theme = 'light' | 'dark';