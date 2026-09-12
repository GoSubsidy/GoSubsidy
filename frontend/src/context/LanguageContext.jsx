import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n'; // The i18next configuration file

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'ur', name: 'اردو (Urdu)' }
];

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('gosubsidy_global_lang') || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(currentLang);
    localStorage.setItem('gosubsidy_global_lang', currentLang);
    // Adjust document text direction dynamically if Urdu is chosen
    document.documentElement.dir = currentLang === 'ur' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}