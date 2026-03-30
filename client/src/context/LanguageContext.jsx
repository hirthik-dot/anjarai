// client/src/context/LanguageContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import translations from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('anjarai_lang') || 'en';
    } catch { return 'en'; }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'ta' : 'en';
      try { localStorage.setItem('anjarai_lang', next); } catch {}
      return next;
    });
  }, []);

  const setLanguage = useCallback((code) => {
    setLang(code);
    try { localStorage.setItem('anjarai_lang', code); } catch {}
  }, []);

  // Translation function — returns Tamil if lang=ta and translation exists, else returns original
  const t = useCallback((key) => {
    if (lang === 'en') return key;
    return translations[key] || key;
  }, [lang]);

  const isTamil = lang === 'ta';

  const value = useMemo(() => ({
    lang, isTamil, toggleLang, setLanguage, t
  }), [lang, isTamil, toggleLang, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};
