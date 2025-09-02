import React, { createContext, useContext } from 'react';
import i18n from '../services/i18n';
import { useTranslation } from 'react-i18next';

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const { t, i18n: i18nInstance } = useTranslation();

  const changeLanguage = (language) => {
    i18nInstance.changeLanguage(language);
  };

  return (
    <I18nContext.Provider value={{ t, changeLanguage, currentLanguage: i18nInstance.language }}>
      {children}
    </I18nContext.Provider>
  );
};
