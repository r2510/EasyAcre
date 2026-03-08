'use client';

import { useState, useEffect, useCallback } from 'react';
import { Landing } from './landing';
import { Home } from './home';
import { CityProvider } from '@/lib/city-context';

export default function Page() {
  const [showHome, setShowHome] = useState(false);

  const goHome = useCallback(() => {
    window.history.pushState({ view: 'home' }, '');
    setShowHome(true);
  }, []);

  const goLanding = useCallback(() => {
    setShowHome(false);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setShowHome(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <CityProvider>
      {!showHome ? (
        <Landing onExplore={goHome} />
      ) : (
        <Home onLogout={goLanding} />
      )}
    </CityProvider>
  );
}
