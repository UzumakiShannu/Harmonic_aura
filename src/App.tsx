import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { User, Theme } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load saved user and theme from localStorage
    const savedUser = localStorage.getItem('chakra_user');
    const savedTheme = localStorage.getItem('chakra_theme') as Theme;
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleAuthenticate = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('chakra_user', JSON.stringify(authenticatedUser));
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('chakra_user');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('chakra_theme', newTheme);
  };

  if (!user) {
    return <AuthScreen onAuthenticate={handleAuthenticate} theme={theme} />;
  }

  return (
    <Dashboard 
      user={user} 
      theme={theme}
      onThemeToggle={handleThemeToggle}
      onSignOut={handleSignOut}
    />
  );
}

export default App;