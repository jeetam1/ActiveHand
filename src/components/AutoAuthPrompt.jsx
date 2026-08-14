import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AutoAuthPrompt() {
  const { isAuthenticated, isAuthModalOpen, openAuth } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated || isAuthModalOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const hasPrompted = sessionStorage.getItem('activehands_auto_auth_shown');
    if (hasPrompted) return;

    const handleScroll = () => {
      if (window.scrollY > 350) {
        if (!timerRef.current && !sessionStorage.getItem('activehands_auto_auth_shown')) {
          timerRef.current = setTimeout(() => {
            if (!isAuthenticated && !sessionStorage.getItem('activehands_auto_auth_shown')) {
              sessionStorage.setItem('activehands_auto_auth_shown', 'true');
              openAuth('login');
            }
          }, 3000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, isAuthModalOpen, openAuth]);

  return null;
}
